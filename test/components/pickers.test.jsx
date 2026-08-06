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

/*
 * v3's calendar header carried only the arrows and the month label — the year view was reached from
 * the toolbar's year button. v8 adds a switch-to-year caret beside the label instead, so it is hidden
 * where the toolbar offers that year button, and kept where it does not.
 */
describe('the v3 calendar header', () => {
    const open = (ui) => {
        render(withAdapter(ui));
        fireEvent.click(screen.getByRole('textbox'));
    };
    const caret = () => document.querySelector('.MuiPickersCalendarHeader-switchViewButton');
    // Asserted on the emitted rule rather than the computed style: jsdom's cascade ignores selector
    // specificity, so MUI's own `display: inline-flex` (one class) wins there over the layout's
    // descendant rule (two classes), which is not what a browser does.
    const caretHiddenByLayout = () => {
        // Keyed to THIS layout's own emotion class: the stylesheet is shared by every render in the
        // file, so a rule left behind by another picker would otherwise count.
        const layoutClass = Array.from(document.querySelector('.MuiPickersLayout-root').classList).find((name) => name.startsWith('css-'));
        return Array.from(document.styleSheets)
            .flatMap((sheet) => Array.from(sheet.cssRules || []))
            .some((rule) => (rule.cssText || '').includes(`.${layoutClass} .MuiPickersCalendarHeader-switchViewButton`) && /display: none/.test(rule.cssText));
    };

    test('drops the switch-to-year caret on a date-time picker, which has a year in its toolbar', () => {
        open(<DateTimePicker label="When" value={'2026-08-06T19:40:00.000Z'} onChange={() => {}} />);

        expect(Array.from(document.querySelectorAll('.MuiPickersLayout-toolbar button')).map((b) => b.textContent)).toContain('2026');
        expect(caret()).toBeInTheDocument();
        expect(caretHiddenByLayout()).toBe(true);
    });

    test('keeps it on a date-only picker, whose toolbar renders the date alone', () => {
        open(<DatePicker label="When" value={'2026-08-06T19:40:00.000Z'} onChange={() => {}} />);

        expect(document.querySelectorAll('.MuiPickersLayout-toolbar button')).toHaveLength(0);
        expect(caretHiddenByLayout()).toBe(false);
    });
});

/*
 * v3 moved straight on: pick a day and the time view opens. v8 splits a date-time picker's views into
 * two steps and waits for a "Next" action instead, so the move is driven by the component.
 */
describe('DateTimePicker view flow', () => {
    const openPicker = (props) => {
        render(withAdapter(<DateTimePicker label="When" value={'2026-08-06T19:40:00.000Z'} onChange={() => {}} {...props} />));
        fireEvent.click(screen.getByRole('textbox'));
    };
    const onTimeView = () => !!document.querySelector('.MuiClock-root');

    test('a day click opens the time view', () => {
        openPicker();
        expect(onTimeView()).toBe(false);

        fireEvent.click(screen.getByRole('gridcell', { name: '15' }));

        expect(onTimeView()).toBe(true);
    });

    test('a day click opens it even when the consumer remounts the picker on open', () => {
        // The form designer changes the picker's `key` in its own onOpen, so the component starts
        // over with no view tracked; an untracked view has to count as the day view it opens on.
        openPicker({ key: 'remounted' });

        fireEvent.click(screen.getByRole('gridcell', { name: '15' }));

        expect(onTimeView()).toBe(true);
    });

    test('stays on the date view when the caller narrowed views to dates only', () => {
        openPicker({ views: ['year', 'day'] });

        fireEvent.click(screen.getByRole('gridcell', { name: '15' }));

        expect(onTimeView()).toBe(false);
    });
});
