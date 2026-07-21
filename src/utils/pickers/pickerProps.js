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
 * Splits the legacy prop bag into { pickerProps, textFieldProps, slots, slotProps }.
 * Handled specially: inputVariant, clearable, showTodayButton, disableToolbar,
 * TextFieldComponent, minDate/maxDate coercion.
 */
export const splitLegacyPickerProps = (props) => {
    const rest = { ...props };
    const textFieldProps = {};

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

    return { pickerProps: rest, slots, slotProps };
};
