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

// Keys the v8 field steps a section value with (`useFieldRootHandleKeyDown`).
const SECTION_STEP_KEYS = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];

// Validation errors that mean "outside the range the picker was given".
const RANGE_VALIDATION_ERRORS = ['minDate', 'maxDate', 'minTime', 'maxTime', 'minDateTime', 'maxDateTime'];

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
        const key = next ? String(next.valueOf()) : 'empty';
        if (key !== lastKey) {
            lastKey = key;
            lastMoment = next;
        }
        return lastMoment;
    };
};

/**
 * Refuses a section step that walks out of the picker's own date/time range.
 *
 * v8 steps a section with the arrow/page/home/end keys through that section's boundaries only:
 * `getSectionsBoundaries` caps a 4-digit year at 9999 whatever `minDate`/`maxDate` say, so the
 * keyboard crosses a bound the calendar refuses to (default `maxDate` is 2099-12-31). The step is
 * published through `onChange` synchronously inside the same keydown, so a flag raised in the
 * capture phase is enough to tell a stepped change from a typed one — typing stays untouched,
 * because its intermediate values (year `0002` on the way to `2026`) must keep flowing through.
 *
 * Dropping the change is all it takes to undo the step: `updateSectionValue` builds the stepped
 * sections locally and only publishes them, while the field paints `state.sections`, which is
 * rebuilt from the value prop. A step that is never published leaves the field as it was.
 */
export const createFieldStepGuard = () => {
    let stepping = false;
    return {
        // Raised before the field's own keydown handler steps the section, and dropped again when
        // the step is read below. It must NOT be dropped on a microtask or from a bubble-phase
        // handler on the same slot: React attaches its capture-phase and bubble-phase listeners to
        // the root container as two separate native listeners, and the browser runs a microtask
        // checkpoint when each of them returns, so a microtask reset lands BEFORE the step is
        // published — and a bubble reset on `slotProps.textField` runs before the field's own
        // handler, not after it. Either way the step went through (the year walked past 2099).
        //
        // A step key that publishes nothing (an incomplete date) therefore leaves the flag raised
        // until the next key press. That cannot misfire on a later view selection: the calendar
        // disables out-of-range days and the year list stops at the bounds, so a view change cannot
        // carry a range validation error in the first place.
        onKeyDownCapture: (event) => {
            stepping = SECTION_STEP_KEYS.includes(event.key);
        },
        refuses: (context) => {
            const refused = stepping && RANGE_VALIDATION_ERRORS.includes(context?.validationError);
            stepping = false;
            return refused;
        },
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
 * Puts a step guard's capture-phase key handler on a `slotProps.textField` bag, keeping whatever the
 * caller already had there. Capture, because the field's own keydown handler steps the section value
 * and publishes it in the bubble phase.
 */
export const withStepGuard = (textFieldProps, guard) => {
    const apply = (resolved) => ({
        ...resolved,
        onKeyDownCapture: (event) => {
            guard.onKeyDownCapture(event);
            resolved?.onKeyDownCapture?.(event);
        },
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
