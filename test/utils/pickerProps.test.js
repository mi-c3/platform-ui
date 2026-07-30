import { splitLegacyPickerProps, withDisabledUnderline } from '../../src/utils/pickers/pickerProps';

const CustomInput = () => null;

test('opts out of the accessible field DOM structure when a TextFieldComponent is given', () => {
    const { pickerProps, slots } = splitLegacyPickerProps({ TextFieldComponent: CustomInput });
    expect(slots.textField).toBe(CustomInput);
    // v8 defaults this to true, which makes the field throw when the slot renders a
    // plain <input /> — the legacy TextFieldComponent contract.
    expect(pickerProps.enableAccessibleFieldDOMStructure).toBe(false);
    expect(pickerProps.TextFieldComponent).toBeUndefined();
});

test('keeps an explicit enableAccessibleFieldDOMStructure over the legacy default', () => {
    const { pickerProps } = splitLegacyPickerProps({
        TextFieldComponent: CustomInput,
        enableAccessibleFieldDOMStructure: true,
    });
    expect(pickerProps.enableAccessibleFieldDOMStructure).toBe(true);
});

test('leaves the accessible field DOM structure alone when no textField slot is given', () => {
    const { pickerProps, slots } = splitLegacyPickerProps({ label: 'From' });
    expect(slots.textField).toBeUndefined();
    expect('enableAccessibleFieldDOMStructure' in pickerProps).toBe(false);
});

test('opts out of the accessible field DOM structure for a v8 slots.textField too', () => {
    // A caller-supplied field is a caller-supplied field: the v8 `slots` bag gets the same
    // default as the legacy `TextFieldComponent`, or the same plain <input /> throws.
    const { pickerProps, slots } = splitLegacyPickerProps({ slots: { textField: CustomInput } });
    expect(slots.textField).toBe(CustomInput);
    expect(pickerProps.enableAccessibleFieldDOMStructure).toBe(false);
});

test('keeps an explicit enableAccessibleFieldDOMStructure over a v8 slots.textField', () => {
    const { pickerProps } = splitLegacyPickerProps({
        slots: { textField: CustomInput },
        enableAccessibleFieldDOMStructure: true,
    });
    expect(pickerProps.enableAccessibleFieldDOMStructure).toBe(true);
});

test('leaves the accessible field DOM structure alone for a v8 slots bag without a textField', () => {
    const { pickerProps } = splitLegacyPickerProps({ slots: { openPickerIcon: CustomInput } });
    expect('enableAccessibleFieldDOMStructure' in pickerProps).toBe(false);
});

describe('a v8 slots/slotProps bag passed through', () => {
    const openPickerIcon = () => null;

    test('merges per slot over what the legacy props produced', () => {
        const { pickerProps, slots, slotProps } = splitLegacyPickerProps({
            label: 'From',
            clearable: true,
            slots: { openPickerIcon },
            slotProps: { field: { readOnly: true }, actionBar: { actions: ['today', 'cancel', 'accept'] } },
        });
        expect(slots.openPickerIcon).toBe(openPickerIcon);
        // `clearable` came from the legacy prop, `readOnly` from the caller — neither wins outright.
        expect(slotProps.field).toEqual({ clearable: true, readOnly: true });
        expect(slotProps.actionBar).toEqual({ actions: ['today', 'cancel', 'accept'] });
        expect(slotProps.textField).toEqual({ label: 'From' });
        // Consumed, not forwarded to the picker.
        expect(pickerProps.slots).toBeUndefined();
        expect(pickerProps.slotProps).toBeUndefined();
    });

    test('merges a slotProps callback over the derived props rather than dropping them', () => {
        const textField = () => ({ helperText: 'resolved' });
        const { slotProps } = splitLegacyPickerProps({ label: 'From', slotProps: { textField } });

        // Still a callback, since MUI resolves it against ownerState — but the props the legacy
        // bag routed to the field survive it.
        expect(typeof slotProps.textField).toBe('function');
        expect(slotProps.textField({})).toEqual({ label: 'From', helperText: 'resolved' });
    });

    test('passes ownerState to a slotProps callback', () => {
        const textField = jest.fn(() => ({}));
        const { slotProps } = splitLegacyPickerProps({ slotProps: { textField } });
        slotProps.textField({ inputSize: 'small' });

        expect(textField).toHaveBeenCalledWith({ inputSize: 'small' });
    });

    test('lets a slotProps callback win over the derived value of the same prop', () => {
        const textField = () => ({ label: 'from the callback' });
        const { slotProps } = splitLegacyPickerProps({ label: 'From', slotProps: { textField } });

        expect(slotProps.textField({}).label).toBe('from the callback');
    });
});

describe('withDisabledUnderline', () => {
    test('defaults disableUnderline on an object of text field props', () => {
        expect(withDisabledUnderline({ label: 'From' })).toEqual({ label: 'From', InputProps: { disableUnderline: true } });
    });

    test('keeps an explicit disableUnderline, and the rest of InputProps', () => {
        const withUnderline = withDisabledUnderline({ InputProps: { disableUnderline: false, readOnly: true } });
        expect(withUnderline.InputProps).toEqual({ disableUnderline: false, readOnly: true });
    });

    test('defaults it through a callback without calling or mutating it', () => {
        const textField = jest.fn((ownerState) => ({ helperText: ownerState.helperText }));
        const wrapped = withDisabledUnderline(textField);

        expect(textField).not.toHaveBeenCalled();
        // Regression: the default used to be assigned onto whatever `slotProps.textField` was, so
        // a callback had an `InputProps` key hung off the function and never got the default.
        expect(textField.InputProps).toBeUndefined();
        expect(wrapped({ helperText: 'resolved' })).toEqual({
            helperText: 'resolved',
            InputProps: { disableUnderline: true },
        });
    });
});
