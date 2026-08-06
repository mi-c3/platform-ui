import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import { createMomentValueCache } from 'utils/pickers/pickerProps';

/**
 * The commit semantics shared by the modal pickers: a selection is a draft, and only the action
 * bar's "OK" publishes it. `@material-ui/pickers` v3 worked this way, and the application depends on
 * it — the form designer freezes the value it hands a picker for as long as the dialog is open, so
 * that a subscription update cannot overwrite an edit in progress. A v8 picker publishes every
 * selection instead, which turned that freeze into a dialog whose clicks never highlighted.
 *
 * A controlled v8 picker keeps NO draft of its own: `usePicker` renders the views from the `value`
 * prop (only the clock hand gets a shallow value of its own), so swallowing the intermediate changes
 * without feeding them back leaves every click unhighlighted. The draft is therefore held here and
 * handed down as `value` while the dialog is open, and the consumer hears nothing until "OK".
 *
 * That still leaves the accept working, because v8 decides it against `state.lastCommittedValue`
 * (`useValueAndOpenStates`: `shouldFireOnAccept = changeImportance === 'accept' && !areValuesEqual(
 * newValue, state.lastCommittedValue)`), and that only moves when an accept actually fires — never on
 * the intermediate selections. So "OK" compares the draft against the value the dialog opened on.
 *
 * "Cancel" needs no snapshot either: nothing was published, so dropping the draft puts the field back
 * on the value the consumer still holds.
 *
 * Subclasses render; everything here is state and handlers. `view` is tracked because v8 refuses to
 * cross its own view-step boundary without a "Next" button, which v3 had no notion of.
 */
class V3ModalPickerBase extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        onAccept: PropTypes.func,
        onClose: PropTypes.func,
        onOpen: PropTypes.func,
        onViewChange: PropTypes.func,
        // Editable v8 section field in an inline popper, publishing as it goes. Opt-in, for a screen
        // that wants typing; every existing consumer expects the v3 modal.
        keyboardInput: PropTypes.bool,
        // 'change' publishes every selection: what a caller that runs its own accept needs (the
        // range modal snapshots both ends itself).
        commitOn: PropTypes.oneOf(['accept', 'change']),
    };

    static defaultProps = {
        inputVariant: 'filled',
        margin: 'normal',
        fullWidth: true,
        clearable: false,
        keyboardInput: false,
        commitOn: 'accept',
    };

    state = {
        // Undefined while nothing is being edited: the dialog then renders what the consumer holds.
        draft: undefined,
        view: undefined,
        open: false,
    };

    toValue = createMomentValueCache();

    /**
     * Whether the dialog is open. Tracked here because the trigger is a click anywhere in the field
     * rather than MUI's own open-picker button, and a click on a slot cannot open the picker by
     * itself. A caller driving `open` (the form designer does) still wins.
     */
    get open() {
        const { open } = this.props;
        return open !== undefined ? open : this.state.open;
    }

    get holdsDraft() {
        const { keyboardInput, commitOn } = this.props;
        return !keyboardInput && commitOn === 'accept';
    }

    /**
     * The view to render: a caller driving it explicitly wins over the one tracked here, and the
     * picker's first view stands in until something is tracked.
     *
     * Never undefined, because v8 decides whether `view` is controlled on the FIRST render and
     * ignores it from then on if it started out undefined — the dialog would open on the day view
     * and stay there however the component drove it afterwards.
     */
    get view() {
        const { view } = this.props;
        if (view !== undefined) {
            return view;
        }
        return this.state.view || this.firstView;
    }

    publish(value) {
        const { onChange, name, type } = this.props;
        onChange && onChange(createEvent('change', { target: { name, value, type } }));
    }

    @bind
    onChange(value) {
        if (this.holdsDraft) {
            // Held, not published: this is what keeps an intermediate click out of the consumer's
            // value (and out of a form's dirty state) while still lighting it up in the views.
            this.setState({ draft: value });
            return;
        }
        this.publish(value);
    }

    @bind
    onAccept(value) {
        const { onAccept } = this.props;
        if (this.holdsDraft) {
            this.publish(value);
        }
        this.setState({ draft: undefined, view: undefined, open: false });
        onAccept && onAccept(value);
    }

    @bind
    onClose() {
        const { onClose } = this.props;
        // Dropping the draft IS v3's "Cancel": nothing was published, so the value the consumer
        // holds never moved, and the field goes back to showing it.
        this.setState({ draft: undefined, view: undefined, open: false });
        onClose && onClose();
    }

    @bind
    onOpen() {
        const { onOpen, disabled, readOnly } = this.props;
        if (disabled || readOnly) {
            return;
        }
        this.setState({ view: this.firstView, open: true });
        onOpen && onOpen();
    }

    @bind
    onViewChange(view) {
        const { onViewChange } = this.props;
        this.setState({ view });
        onViewChange && onViewChange(view);
    }

    /** The value driving the dialog: the draft while there is one, else what the consumer holds. */
    get pickerValue() {
        const { draft } = this.state;
        return draft !== undefined ? draft : this.toValue(this.props.value);
    }
}

export default V3ModalPickerBase;
