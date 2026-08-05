import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import InputBase from '@mui/material/InputBase';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker, DateTimePicker, TimePicker } from '../../src';

const withAdapter = (ui) => <LocalizationProvider dateAdapter={AdapterMoment}>{ui}</LocalizationProvider>;

// The legacy v3 contract: the slot renders one plain <input />.
const LegacyInput = ({ value, onClick, placeholder, disabled }) => (
    <InputBase disabled={disabled} placeholder={placeholder} value={value} onClick={onClick} />
);

describe.each([
    ['DatePicker', DatePicker],
    ['TimePicker', TimePicker],
    ['DateTimePicker', DateTimePicker],
])('%s', (name, Picker) => {
    test('renders a legacy TextFieldComponent', () => {
        // v8 defaults `enableAccessibleFieldDOMStructure` to true, which throws on a plain
        // <input /> ('The `sectionListRef` prop has not been initialized by `PickersSectionList`').
        render(withAdapter(<Picker label="x" value={null} onChange={() => {}} TextFieldComponent={LegacyInput} />));
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('throws on a legacy TextFieldComponent when the accessible structure is forced back on', () => {
        expect(() =>
            render(
                withAdapter(
                    <Picker label="x" value={null} onChange={() => {}} TextFieldComponent={LegacyInput} enableAccessibleFieldDOMStructure />
                )
            )
        ).toThrow();
    });

    test('renders a plain-input textField passed through the v8 slots bag', () => {
        // Regression: the `slots` passthrough honoured the slot but skipped the structure
        // opt-out that `TextFieldComponent` gets, so the same field threw.
        render(withAdapter(<Picker label="x" value={null} onChange={() => {}} slots={{ textField: LegacyInput }} />));
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
});

describe.each([
    ['DatePicker', DatePicker],
    ['TimePicker', TimePicker],
    ['DateTimePicker', DateTimePicker],
])('%s with a slotProps.textField callback', (name, Picker) => {
    test('keeps the props the legacy bag routed to the field, and leaves the callback alone', () => {
        const textField = jest.fn(() => ({ helperText: 'from the callback' }));
        render(withAdapter(<Picker label="labelled" value={null} onChange={() => {}} slotProps={{ textField }} />));

        expect(screen.getByText('from the callback')).toBeInTheDocument();
        // The label came from the legacy bag, the helper text from the callback: neither side won
        // outright. Matched as text because the accessible field labels both a group and an input.
        expect(screen.getByText('labelled')).toBeInTheDocument();
        // The underline default used to be assigned onto the callback itself.
        expect(textField.InputProps).toBeUndefined();
        expect(textField.mock.results[0].value.InputProps).toBeUndefined();
    });
});

describe('DateTimePicker variant="dialog"', () => {
    const renderDialogPicker = (props) =>
        render(
            withAdapter(
                <DateTimePicker
                    variant="dialog"
                    label="From"
                    value={null}
                    onChange={() => {}}
                    enableAccessibleFieldDOMStructure={false}
                    {...props}
                />
            )
        );

    test('opens the v3 modal picker: toolbar, date/time tabs, action bar', () => {
        renderDialogPicker({ slotProps: { actionBar: { actions: ['today', 'cancel', 'accept'] } } });
        fireEvent.click(screen.getByRole('button', { name: /choose date/i }));

        expect(document.querySelector('.MuiDialog-root')).toBeInTheDocument();
        expect(document.querySelector('.MuiPickersToolbar-root')).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'pick date' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'pick time' })).toBeInTheDocument();
        const actions = Array.from(document.querySelectorAll('.MuiPickersLayout-actionBar button'));
        expect(actions.map((button) => button.textContent)).toEqual(['Today', 'Cancel', 'OK']);
    });

    test('stays on the responsive picker for any other variant', () => {
        renderDialogPicker({ variant: 'inline' });
        fireEvent.click(screen.getByRole('button', { name: /choose date/i }));

        expect(document.querySelector('.MuiDialog-root')).not.toBeInTheDocument();
        expect(screen.queryByRole('tab', { name: 'pick date' })).not.toBeInTheDocument();
    });
});

// A consumer of these pickers owns the value: v8 renders the field and the views from what comes
// back down, so a change that is never published has to be visible as a field that snapped back.
const ControlledPicker = ({ Picker, initialValue, onChange, ...props }) => {
    const [value, setValue] = React.useState(initialValue);
    const handleChange = (event) => {
        onChange(event);
        setValue(event.target.value);
    };
    // `selectedSections` picks the section the arrow keys step: focus does not carry it in jsdom.
    return <Picker label="From" value={value} onChange={handleChange} selectedSections="year" {...props} />;
};

describe.each([
    ['DatePicker', DatePicker],
    ['DateTimePicker', DateTimePicker],
])('%s keyboard section stepping', (name, Picker) => {
    const renderPicker = (initialValue, props) => {
        const onChange = jest.fn();
        render(withAdapter(<ControlledPicker Picker={Picker} initialValue={initialValue} onChange={onChange} {...props} />));
        return { onChange, year: screen.getAllByRole('spinbutton').find((section) => section.getAttribute('aria-label') === 'Year') };
    };

    test('refuses a year step past the default maxDate', () => {
        // The calendar stops at 2099 (v8's default maxDate), but the field steps a 4-digit year
        // section through 0..9999 whatever the bounds are — see `getSectionsBoundaries`.
        const { onChange, year } = renderPicker('2099-06-15T10:00:00.000Z');

        fireEvent.keyDown(year, { key: 'ArrowUp' });

        expect(onChange).not.toHaveBeenCalled();
        expect(year).toHaveTextContent('2099');
    });

    test('refuses a year step before the default minDate', () => {
        const { onChange, year } = renderPicker('1900-06-15T10:00:00.000Z');

        fireEvent.keyDown(year, { key: 'ArrowDown' });

        expect(onChange).not.toHaveBeenCalled();
        expect(year).toHaveTextContent('1900');
    });

    test('refuses a year step past an explicit maxDate', () => {
        const { onChange, year } = renderPicker('2030-06-15T10:00:00.000Z', { maxDate: '2030-12-31' });

        fireEvent.keyDown(year, { key: 'ArrowUp' });

        expect(onChange).not.toHaveBeenCalled();
        expect(year).toHaveTextContent('2030');
    });

    test('refuses a year step past the default maxDate with a microtask checkpoint mid-dispatch', async () => {
        // What a real browser does between React's capture-phase and bubble-phase root listeners,
        // and jsdom does not: run a microtask checkpoint. fireEvent cannot interleave one, so the
        // flag's lifetime is asserted directly in test/utils/pickerProps.test.js — this only pins
        // that an awaited turn around the step changes nothing.
        const { onChange, year } = renderPicker('2099-06-15T10:00:00.000Z');

        fireEvent.keyDown(year, { key: 'ArrowUp' });
        await Promise.resolve();
        fireEvent.keyDown(year, { key: 'ArrowUp' });

        expect(onChange).not.toHaveBeenCalled();
        expect(year).toHaveTextContent('2099');
    });

    test('steps the year inside the range', () => {
        const { onChange, year } = renderPicker('2098-06-15T10:00:00.000Z');

        fireEvent.keyDown(year, { key: 'ArrowUp' });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target.value.year()).toBe(2099);
        expect(year).toHaveTextContent('2099');
    });
});
