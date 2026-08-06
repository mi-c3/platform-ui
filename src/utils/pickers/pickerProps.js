import moment from 'moment';

/*
 * Translates the legacy @material-ui/pickers v3 wrapper API (still used by the
 * consuming application) into @mui/x-date-pickers v8 props, so the exported
 * DatePicker/TimePicker/DateTimePicker keep their external contract.
 */

// Props that belong to the rendered text field in v8 (slotProps.textField).
const TEXT_FIELD_KEYS = [
    'label', 'placeholder', 'helperText', 'error', 'required', 'name', 'id',
    'margin', 'fullWidth', 'autoFocus', 'size', 'onBlur', 'onFocus',
    'InputProps', 'inputProps', 'InputLabelProps', 'className', 'style',
];

// v3-only props with no v8 equivalent — dropped so they don't leak to the DOM.
const DROPPED_V3_KEYS = [
    'animateYearScrolling', 'allowKeyboardControl', 'invalidDateMessage',
    'invalidLabel', 'initialFocusedDate', 'emptyLabel', 'okLabel', 'cancelLabel',
    'todayLabel', 'clearLabel', 'PopoverProps', 'DialogProps', 'keyboard',
    'KeyboardButtonProps', 'variant', 'orientation', 'strictCompareDates',
];

export const toMomentOrNull = (value) => (value ? moment(value) : null);

/**
 * Hands out the moment instance for a value, reusing the previous one while the instant is
 * unchanged. v8 detects an externally changed value by REFERENCE — both `useFieldState` and
 * `useValueAndOpenStates` compare `value !== lastExternalValue` — and on a new reference it
 * rebuilds the field's sections and drops the clock's shallow selection. Converting with
 * `moment(value)` inside render therefore looks like a new external value on every parent
 * re-render, throwing away an edit in progress.
 */
export const createMomentValueCache = () => {
    let lastKey = null;
    let lastMoment = null;
    return (value) => {
        const next = toMomentOrNull(value);
        // The offset is part of the key because the adapter formats a moment in its own zone: the
        // same instant at a different offset is a different value to display.
        const key = next ? `${next.valueOf()}|${next.utcOffset()}` : 'empty';
        if (key !== lastKey) {
            lastKey = key;
            lastMoment = next;
        }
        return lastMoment;
    };
};

const resolveSlotProps = (slotProps, ownerState) => (typeof slotProps === 'function' ? slotProps(ownerState) : slotProps);

/**
 * Merges a caller-supplied `slotProps` bag over another one, per slot, so neither side has to win
 * outright. MUI also accepts a function per slot, resolved against ownerState; a slot where either
 * side is one stays a function and merges what the two resolve to.
 */
export const mergeSlotProps = (derived, override) => {
    const merged = { ...derived };
    Object.keys(override || {}).forEach((slot) => {
        const base = merged[slot];
        const extra = override[slot];
        merged[slot] =
            typeof base === 'function' || typeof extra === 'function'
                ? (ownerState) => ({ ...resolveSlotProps(base, ownerState), ...resolveSlotProps(extra, ownerState) })
                : { ...base, ...extra };
    });
    return merged;
};

/**
 * Defaults `InputProps.disableUnderline` on a `slotProps.textField` bag, which v3 rendered without
 * one. Kept out of `splitLegacyPickerProps` because it is the picker components' default, not part
 * of the prop translation. Handles a callback bag, which is why it can't just be assigned onto.
 */
export const withDisabledUnderline = (textFieldProps) => {
    const apply = (resolved) => ({
        ...resolved,
        InputProps: { disableUnderline: true, ...(resolved?.InputProps || {}) },
    });
    return typeof textFieldProps === 'function' ? (ownerState) => apply(textFieldProps(ownerState)) : apply(textFieldProps);
};

/**
 * Splits the legacy prop bag into { pickerProps, textFieldProps, slots, slotProps }.
 * Handled specially: inputVariant, clearable, showTodayButton, disableToolbar,
 * TextFieldComponent, minDate/maxDate coercion. A v8 `slots`/`slotProps` bag may be passed
 * through as-is; it is merged per slot over what the legacy props produced.
 */
export const splitLegacyPickerProps = (props) => {
    const rest = { ...props };
    const textFieldProps = {};
    const slotsOverride = rest.slots || {};
    const slotPropsOverride = rest.slotProps || {};
    delete rest.slots;
    delete rest.slotProps;

    TEXT_FIELD_KEYS.forEach((key) => {
        if (key in rest) {
            textFieldProps[key] = rest[key];
            delete rest[key];
        }
    });
    DROPPED_V3_KEYS.forEach((key) => {
        delete rest[key];
    });

    if ('inputVariant' in rest) {
        textFieldProps.variant = rest.inputVariant;
        delete rest.inputVariant;
    }

    const slots = {};
    if (rest.TextFieldComponent) {
        slots.textField = rest.TextFieldComponent;
        delete rest.TextFieldComponent;
    }
    // v8 defaults `enableAccessibleFieldDOMStructure` to true, so the field expects its
    // textField slot to render a `PickersSectionList` and THROWS ("The `sectionListRef` prop
    // has not been initialized by `PickersSectionList`") when it renders a plain `<input />`.
    // The legacy v3 `TextFieldComponent` contract is a single input, and a slot reaching us
    // through the v8 `slots` bag is on the same footing — either way the caller supplied the
    // field, so opt that structure back in unless it asked for the accessible one explicitly.
    if ((slots.textField || slotsOverride.textField) && !('enableAccessibleFieldDOMStructure' in rest)) {
        rest.enableAccessibleFieldDOMStructure = false;
    }

    const slotProps = { textField: textFieldProps };

    // v3 `clearable` rendered a clear adornment on the input; v8's field
    // clearable is the equivalent (clears by firing onChange(null)).
    if (rest.clearable) {
        slotProps.field = { clearable: true };
    }
    if (rest.showTodayButton) {
        slotProps.actionBar = { actions: ['today'] };
    }
    delete rest.clearable;
    delete rest.showTodayButton;

    if (rest.disableToolbar) {
        slotProps.toolbar = { hidden: true };
        delete rest.disableToolbar;
    }

    if (rest.minDate) {
        rest.minDate = moment(rest.minDate);
    }
    if (rest.maxDate) {
        rest.maxDate = moment(rest.maxDate);
    }

    return {
        pickerProps: rest,
        slots: { ...slots, ...slotsOverride },
        slotProps: mergeSlotProps(slotProps, slotPropsOverride),
    };
};
