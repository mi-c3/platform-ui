import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import moment from 'moment';
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
        // The field is the trigger, as it was in v3: the standalone pickers render no button of
        // their own (the range modal asks for its leading calendar icon explicitly).
        fireEvent.click(screen.getByRole('textbox'));

        expect(document.querySelector('.MuiDialog-root')).toBeInTheDocument();
        expect(document.querySelector('.MuiPickersToolbar-root')).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'pick date' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'pick time' })).toBeInTheDocument();
        const actions = Array.from(document.querySelectorAll('.MuiPickersLayout-actionBar button'));
        expect(actions.map((button) => button.textContent)).toEqual(['Today', 'Cancel', 'OK']);
    });

    test('opens the same modal without the variant, which is now the default', () => {
        renderDialogPicker({ variant: 'inline' });
        fireEvent.click(screen.getByRole('textbox'));

        expect(document.querySelector('.MuiDialog-root')).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'pick date' })).toBeInTheDocument();
    });
});

/*
 * The v3 modal contract, measured on staging (platform-ui 1.8.9 + @material-ui/pickers 3.2.10) and
 * restored here: `input[name=dateTime]` is a read-only text box with no section spinbuttons, a click
 * anywhere in it opens a dialog, clicking Aug 14 left the field on "Aug 6th 2026, 19:40", and only
 * "OK" turned it into "Aug 21st 2026, 19:41". Cancel put the field back to empty.
 */
describe.each([
    ['DatePicker', DatePicker, 'MMM Do YYYY'],
    ['TimePicker', TimePicker, 'HH:mm'],
    ['DateTimePicker', DateTimePicker, 'MMM Do YYYY, HH:mm'],
])('%s v3 modal parity', (name, Picker, format) => {
    const VALUE = '2026-08-06T19:40:00.000Z';
    const renderPicker = (props) => {
        const onChange = jest.fn();
        const view = render(withAdapter(<Picker label="When" name="when" value={VALUE} onChange={onChange} {...props} />));
        return { onChange, ...view };
    };
    const dialogButton = (label) => Array.from(document.querySelectorAll('.MuiPickersLayout-actionBar button')).find((button) => button.textContent === label);
    const displayed = () => document.querySelector('input').value;

    test('renders one read-only input, no editable sections and no trigger button', () => {
        renderPicker();

        expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
        // v3 had no icon on a standalone field: clicking the field itself opened the picker.
        expect(screen.queryByRole('button', { name: /choose/i })).not.toBeInTheDocument();
        expect(screen.queryAllByRole('spinbutton')).toHaveLength(0);
        expect(displayed()).toBe(moment(VALUE).format(format));
    });

    test('opens the dialog on a click anywhere in the field', () => {
        renderPicker();
        expect(document.querySelector('.MuiDialog-root')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('textbox'));

        expect(document.querySelector('.MuiDialog-root')).toBeInTheDocument();
    });

    test('offers Clear in the action bar when clearable', () => {
        renderPicker({ clearable: true });
        fireEvent.click(screen.getByRole('textbox'));

        expect(dialogButton('Clear')).toBeDefined();
    });

    test('keyboardInput opts back into the editable v8 field in a popper', () => {
        renderPicker({ keyboardInput: true });

        expect(screen.queryAllByRole('spinbutton').length).toBeGreaterThan(0);
        fireEvent.click(screen.getByRole('button', { name: /choose/i }));
        expect(document.querySelector('.MuiDialog-root')).not.toBeInTheDocument();
    });

});

/*
 * The commit point, through the real MUI stack. Only the calendar can be driven from jsdom: the clock
 * computes its selection from pointer geometry against the face, which jsdom has no layout for — so
 * TimePicker's half of this contract is covered by the V3ModalPickerBase unit tests, which every
 * picker inherits from.
 */
describe.each([
    ['DatePicker', DatePicker, 'MMM Do YYYY'],
    ['DateTimePicker', DateTimePicker, 'MMM Do YYYY, HH:mm'],
])('%s commit point', (name, Picker, format) => {
    const VALUE = '2026-08-06T19:40:00.000Z';
    const renderPicker = (props) => {
        const onChange = jest.fn();
        render(withAdapter(<Picker label="When" name="when" value={VALUE} onChange={onChange} {...props} />));
        return { onChange };
    };
    const dialogButton = (label) => Array.from(document.querySelectorAll('.MuiPickersLayout-actionBar button')).find((button) => button.textContent === label);
    const displayed = () => document.querySelector('input').value;
    const pickTheFifteenth = () => fireEvent.click(screen.getByRole('gridcell', { name: '15' }));

    test('holds the selection as a draft: nothing is published and the field does not move', () => {
        const { onChange } = renderPicker();
        fireEvent.click(screen.getByRole('textbox'));

        pickTheFifteenth();

        // Measured on staging: clicking Aug 14 left the field on "Aug 6th 2026, 19:40".
        expect(onChange).not.toHaveBeenCalled();
        expect(displayed()).toBe(moment(VALUE).format(format));
    });

    test('publishes the draft once, on OK', () => {
        const { onChange } = renderPicker();
        fireEvent.click(screen.getByRole('textbox'));
        pickTheFifteenth();

        fireEvent.click(dialogButton('OK'));

        expect(onChange).toHaveBeenCalledTimes(1);
        const { target } = onChange.mock.calls[0][0];
        expect(target.name).toBe('when');
        expect(moment(target.value).date()).toBe(15);
    });

    test('discards the draft on Cancel', () => {
        const { onChange } = renderPicker();
        fireEvent.click(screen.getByRole('textbox'));
        pickTheFifteenth();

        fireEvent.click(dialogButton('Cancel'));

        expect(onChange).not.toHaveBeenCalled();
        expect(displayed()).toBe(moment(VALUE).format(format));
    });

    test('publishes every selection when the caller owns the accept', () => {
        // What DateTimePickerRange needs: it snapshots both ends itself.
        const { onChange } = renderPicker({ commitOn: 'change' });
        fireEvent.click(screen.getByRole('textbox'));

        pickTheFifteenth();

        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
