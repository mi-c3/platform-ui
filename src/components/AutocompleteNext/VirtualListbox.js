import React, { forwardRef, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const ESTIMATED_ROW_HEIGHT = 50;
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
 * The listbox element itself is the scroll container. Rows are absolutely positioned and
 * measured (`measureElement` + `data-index`), so mixed row heights (plain 50px rows vs 60px
 * avatar rows) need no configuration.
 *
 * `scrollControllerRef` is filled with `{ scrollToIndex }` — AutocompleteNext calls it from
 * MUI's `onHighlightChange`, because MUI's own scroll-into-view can only find options that are
 * currently rendered.
 */
const VirtualListbox = forwardRef(function VirtualListbox(props, ref) {
    const { children, scrollControllerRef, style, ...other } = props;
    const items = React.Children.toArray(children);
    const listRef = useRef(null);

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => listRef.current,
        estimateSize: () => ESTIMATED_ROW_HEIGHT,
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

    const rowStyle = start => ({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        boxSizing: 'border-box',
        transform: `translateY(${start}px)`,
    });

    return (
        <ul
            {...other}
            ref={setRefs}
            style={{ ...style, position: 'relative', padding: 0, margin: 0, overflow: 'auto' }}
        >
            <li aria-hidden style={{ height: virtualizer.getTotalSize(), padding: 0, margin: 0, listStyle: 'none' }} />
            {virtualizer.getVirtualItems().map(virtualItem => {
                const item = items[virtualItem.index];
                return React.cloneElement(item, {
                    ref: virtualizer.measureElement,
                    'data-index': virtualItem.index,
                    style: { ...item.props.style, ...rowStyle(virtualItem.start) },
                });
            })}
        </ul>
    );
});

export default VirtualListbox;
