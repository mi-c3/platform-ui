import { createFieldStepGuard, createMomentValueCache, splitLegacyPickerProps, withDisabledUnderline } from '../../src/utils/pickers/pickerProps';

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

describe('createMomentValueCache', () => {
    test('reuses the instance while the instant is unchanged', () => {
        const toValue = createMomentValueCache();
        const first = toValue('2026-06-15T10:00:00.000Z');

        // v8 compares `value !== lastExternalValue` by reference and rebuilds the field's sections
        // when they differ, so an equal instant has to keep the same instance across renders.
        expect(toValue('2026-06-15T10:00:00.000Z')).toBe(first);
        expect(toValue(new Date('2026-06-15T10:00:00.000Z'))).toBe(first);
    });

    test('gives a new instance for a new instant, and null for an empty value', () => {
        const toValue = createMomentValueCache();
        const first = toValue('2026-06-15T10:00:00.000Z');

        expect(toValue('2026-06-15T10:00:01.000Z')).not.toBe(first);
        expect(toValue(null)).toBeNull();
        expect(toValue('')).toBeNull();
    });

});

describe('createFieldStepGuard', () => {
    test('refuses a stepped change that landed out of the picker range', () => {
        const guard = createFieldStepGuard();

        guard.onKeyDownCapture({ key: 'ArrowUp' });
        expect(guard.refuses({ validationError: 'maxDate' })).toBe(true);

        guard.onKeyDownCapture({ key: 'PageDown' });
        expect(guard.refuses({ validationError: 'maxTime' })).toBe(true);
    });

    test('lets a stepped change inside the range through', () => {
        const guard = createFieldStepGuard();

        guard.onKeyDownCapture({ key: 'ArrowDown' });
        expect(guard.refuses({ validationError: null })).toBe(false);
        // Only the range bounds: the field is still where other validation gets reported.
        expect(guard.refuses({ validationError: 'shouldDisableDate' })).toBe(false);
    });

    test('lets a typed out-of-range value through', () => {
        const guard = createFieldStepGuard();

        // Typing a year publishes its intermediate values (`0002` on the way to `2026`), which are
        // out of range and must keep flowing or the digits get thrown away.
        guard.onKeyDownCapture({ key: '2' });
        expect(guard.refuses({ validationError: 'minDate' })).toBe(false);
    });

    test('survives the microtask checkpoint between the capture and bubble listeners', async () => {
        const guard = createFieldStepGuard();

        guard.onKeyDownCapture({ key: 'ArrowUp' });
        // Regression: the flag used to be dropped on a microtask. React attaches its capture-phase
        // and bubble-phase listeners to the root container as two separate native listeners, and the
        // browser runs a microtask checkpoint when each returns — so in a real browser the reset ran
        // before the field published the step, and the step went through (year walked past 2099).
        // jsdom dispatches both phases in one stack, so nothing here caught it.
        await Promise.resolve();
        expect(guard.refuses({ validationError: 'maxDate' })).toBe(true);
    });

    test('forgets the step once it has been read', () => {
        const guard = createFieldStepGuard();

        guard.onKeyDownCapture({ key: 'ArrowUp' });
        expect(guard.refuses({ validationError: 'maxDate' })).toBe(true);
        // A later change from the calendar must not be attributed to that key press.
        expect(guard.refuses({ validationError: 'maxDate' })).toBe(false);
    });

    test('forgets a step that published nothing as soon as another key is pressed', () => {
        const guard = createFieldStepGuard();

        guard.onKeyDownCapture({ key: 'ArrowUp' });
        guard.onKeyDownCapture({ key: '2' });
        expect(guard.refuses({ validationError: 'maxDate' })).toBe(false);
    });
});
