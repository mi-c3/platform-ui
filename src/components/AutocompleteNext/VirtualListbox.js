import React, { forwardRef, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const OVERSCAN = 8;

/**
 * Virtualized listbox for AutocompleteNext, mounted through MUI's
 * `slotProps.listbox.component` so it keeps the `.MuiAutocomplete-listbox` styles, role and
 * interaction props. Renders only the visible option rows (TanStack Virtual), so a 7,000-item
 * icon list costs the same DOM as a 10-item one.
 *
 * This is deliberately a SEPARATE implementation from platform-v1's
 * `app/components/molecules/Virtualized/*` seam (same library, different repo/consumer): the
 * new Autocomplete architecture uses this one; nothing else should.
 *
 * Layout: the listbox element scrolls on BOTH axes. The virtual window is contiguous, so the
 * rendered rows sit in normal flow inside one absolutely positioned rail translated to the
 * first row's offset. The rail is `width: max-content; min-width: 100%`, so rows wider than
 * the popup extend it and the user pans horizontally to read long content — the legacy
 * behavior consumers like the graphic typeahead rely on — while every row shares the rail's
 * width, keeping hover/selection backgrounds uniform.
 *
 * Rows are FIXED HEIGHT (`rowHeight`, the legacy `VirtualListProps.itemSize` contract:
 * 50 default, 60 for avatar-heavy rows) and clip overflow, exactly like the legacy virtual
 * list's row slots.
 *
 * `scrollControllerRef` is filled with `{ ensureIndexVisible }` — AutocompleteNext calls it
 * from MUI's `onHighlightChange`, because MUI's own scroll-into-view can only find options
 * that are currently rendered.
 */
const VirtualListbox = forwardRef(function VirtualListbox(props, ref) {
    const { children, scrollControllerRef, rowHeight = 50, style, ...other } = props;
    const items = React.Children.toArray(children);
    const listRef = useRef(null);

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => listRef.current,
        estimateSize: () => rowHeight,
        overscan: OVERSCAN,
        // React 19: the default synchronous scroll flush warns when it lands inside an
        // in-progress render; TanStack documents disabling it (same setting as the
        // platform-v1 tree seam).
        useFlushSync: false,
    });

    // STABLE merged ref. MUI forks the listbox ref with its own handleListboxRef, which runs
    // syncHighlightedIndex() -> scrollTop = 0 every time the ref re-fires. An unstable ref
    // (e.g. useImperativeHandle recreated per render) re-fires on every virtualizer scroll
    // frame and snaps the list back to the top — the dropdown becomes unscrollable.
    const setRefs = useCallback(node => {
        listRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    }, [ref]);

    if (scrollControllerRef) {
        scrollControllerRef.current = {
            // Bring a (possibly unrendered) option row into the virtual window. Rows that ARE
            // rendered are left to MUI's own scroll-into-view. The actual scroll is deferred
            // out of the calling event dispatch: scrolling (and the re-render it causes)
            // inside MUI's keydown handler corrupts its highlight bookkeeping.
            ensureIndexVisible: index => {
                if (index < 0 || index >= items.length) {
                    return;
                }
                const rendered = virtualizer.getVirtualItems().some(virtualItem => virtualItem.index === index);
                if (!rendered) {
                    setTimeout(() => virtualizer.scrollToIndex(index, { align: 'auto' }), 0);
                }
            },
        };
    }

    const virtualItems = virtualizer.getVirtualItems();
    const railOffset = virtualItems.length ? virtualItems[0].start : 0;

    return (
        <ul
            {...other}
            ref={setRefs}
            style={{ ...style, position: 'relative', padding: 0, margin: 0, overflow: 'auto' }}
        >
            <li aria-hidden style={{ height: virtualizer.getTotalSize(), width: 1, padding: 0, margin: 0, listStyle: 'none' }} />
            <div
                role="presentation"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    minWidth: '100%',
                    width: 'max-content',
                    transform: `translateY(${railOffset}px)`,
                }}
            >
                {virtualItems.map(virtualItem => {
                    const item = items[virtualItem.index];
                    return React.cloneElement(item, {
                        'data-index': virtualItem.index,
                        style: {
                            ...item.props.style,
                            height: rowHeight,
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            minWidth: '100%',
                            width: 'max-content',
                        },
                    });
                })}
            </div>
        </ul>
    );
});

export default VirtualListbox;
