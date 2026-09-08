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

    /*
     * v3's action bar put the bar's OWN action ("Clear", "Today") against the left edge and left
     * Cancel/OK at the right: `@material-ui/pickers` gave that bar a second class,
     * `MuiPickersModal-withAdditionalAction`, whose rule is `justify-content: flex-start` plus
     * `margin-right: auto` on the first child. Measured on staging, Clear sits 8px from the bar's
     * left edge with a resolved 78.6px right margin. MUI v8's `DialogActions` packs everything at
     * the right instead, which bunched Clear up against Cancel.
     */
    test('pushes the action bar\'s own action to the left edge, leaving Cancel/OK at the right', () => {
        renderPicker({ clearable: true });
        fireEvent.click(screen.getByRole('textbox'));

        expect(getComputedStyle(dialogButton('Clear')).marginRight).toBe('auto');
        expect(getComputedStyle(dialogButton('Cancel')).marginRight).toBe('0px');
        expect(getComputedStyle(dialogButton('OK')).marginRight).toBe('0px');
    });

    // v3 added that class only for a bar that HAS an extra action; a plain Cancel/OK bar stayed
    // packed at the right, and pushing Cancel left would be a new layout, not the restored one.
    test('leaves a Cancel/OK-only bar packed at the right', () => {
        renderPicker();
        fireEvent.click(screen.getByRole('textbox'));

        expect(getComputedStyle(dialogButton('Cancel')).marginRight).toBe('0px');
        expect(getComputedStyle(dialogButton('OK')).marginRight).toBe('0px');
    });

    /*
     * v3's rule is `> :first-child`, not "every action that isn't Cancel/OK": a bar carrying BOTH
     * puts Clear on the left and leaves Today packed with Cancel/OK on the right. Kept as v3 had it
     * rather than grouping the two on the left, which would be a new layout.
     */
    test('pins only the first action when the bar carries both Clear and Today', () => {
        renderPicker({ clearable: true, showTodayButton: true });
        fireEvent.click(screen.getByRole('textbox'));

        expect(dialogButton('Clear')).toBeDefined();
        expect(dialogButton('Today')).toBeDefined();
        expect(getComputedStyle(dialogButton('Clear')).marginRight).toBe('auto');
        expect(getComputedStyle(dialogButton('Today')).marginRight).toBe('0px');
        expect(getComputedStyle(dialogButton('Cancel')).marginRight).toBe('0px');
        expect(getComputedStyle(dialogButton('OK')).marginRight).toBe('0px');
    });

    test('treats Today the same way when it is the bar\'s leading action', () => {
        renderPicker({ showTodayButton: true });
        fireEvent.click(screen.getByRole('textbox'));

        expect(getComputedStyle(dialogButton('Today')).marginRight).toBe('auto');
        expect(getComputedStyle(dialogButton('Cancel')).marginRight).toBe('0px');
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
 * What the empty-field fallback puts on screen, not just what it commits: v3 opened on the current
 * date with it selected. Seeding a date the picker itself forbids would render a view with every day
 * disabled, which is why the fallback is bounded.
 */
describe.each([
    ['DatePicker', DatePicker],
    ['DateTimePicker', DateTimePicker],
])('%s empty-field fallback', (name, Picker) => {
    const openPicker = (props) => {
        render(withAdapter(<Picker label="When" name="when" value={null} onChange={() => {}} {...props} />));
        fireEvent.click(screen.getByRole('textbox'));
        return document.querySelector('.MuiPickersDay-root.Mui-selected');
    };

    test('opens the calendar on today, with today selected', () => {
        expect(openPicker()).toHaveTextContent(String(moment().date()));
    });

    test('opens on maxDate instead when today is past it, on a day that can be picked', () => {
        const max = moment().subtract(2, 'years').startOf('month').add(9, 'days');

        const selected = openPicker({ maxDate: max.toDate() });

        expect(selected).toHaveTextContent(String(max.date()));
        expect(selected).not.toBeDisabled();
    });
});

/*
 * v3 committed the date the dialog was opened on when "OK" was pressed with nothing selected — a
 * field that seeds "now" (the form designer's does) therefore commits "now". v8 skips `onAccept`
 * when the value matches what it last committed, so the action bar owns the commit here.
 */
describe.each([
    ['DatePicker', DatePicker],
    ['TimePicker', TimePicker],
    ['DateTimePicker', DateTimePicker],
])('%s accept without a selection', (name, Picker) => {
    const SEEDED = '2026-08-06T19:40:00.000Z';
    const clickOk = () => fireEvent.click(
        Array.from(document.querySelectorAll('.MuiPickersLayout-actionBar button')).find((button) => button.textContent === 'OK')
    );

    test('commits the value the dialog opened on', () => {
        const onChange = jest.fn();
        render(withAdapter(<Picker label="When" name="when" value={SEEDED} onChange={onChange} />));
        fireEvent.click(screen.getByRole('textbox'));

        clickOk();

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(moment(onChange.mock.calls[0][0].target.value).toISOString()).toBe(moment(SEEDED).toISOString());
    });

    test('commits "now" when the field was empty: v3 opened an empty picker on the current date', () => {
        const onChange = jest.fn();
        render(withAdapter(<Picker label="When" name="when" value={null} onChange={onChange} />));
        fireEvent.click(screen.getByRole('textbox'));

        clickOk();

        expect(onChange).toHaveBeenCalledTimes(1);
        const published = onChange.mock.calls[0][0].target.value;
        expect(Math.abs(published.valueOf() - Date.now())).toBeLessThan(5000);
    });

    test('leaves an empty field empty when that dialog is cancelled', () => {
        const onChange = jest.fn();
        render(withAdapter(<Picker label="When" name="when" value={null} onChange={onChange} />));
        fireEvent.click(screen.getByRole('textbox'));

        fireEvent.click(Array.from(document.querySelectorAll('.MuiPickersLayout-actionBar button')).find((b) => b.textContent === 'Cancel'));

        expect(onChange).not.toHaveBeenCalled();
        expect(document.querySelector('input').value).toBe('');
    });

    test('commits nothing more than that: Cancel after opening publishes nothing', () => {
        const onChange = jest.fn();
        render(withAdapter(<Picker label="When" name="when" value={SEEDED} onChange={onChange} />));
        fireEvent.click(screen.getByRole('textbox'));

        fireEvent.click(Array.from(document.querySelectorAll('.MuiPickersLayout-actionBar button')).find((b) => b.textContent === 'Cancel'));

        expect(onChange).not.toHaveBeenCalled();
    });

    test('Clear publishes an empty value', () => {
        const onChange = jest.fn();
        render(withAdapter(<Picker label="When" name="when" value={SEEDED} onChange={onChange} clearable />));
        fireEvent.click(screen.getByRole('textbox'));

        fireEvent.click(Array.from(document.querySelectorAll('.MuiPickersLayout-actionBar button')).find((b) => b.textContent === 'Clear'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target.value).toBeNull();
    });
});

/*
 * A falsy `format`. Consumers store one, and the form designer's "Format predefined" writes `null`
 * into it whenever "Custom" is selected. moment renders a falsy format as ISO-8601, so a default
 * parameter — which only fires for `undefined` — let that reach the field as
 * "2026-08-07T19:54:00+05:00": a time on a date picker, and dashes whatever the caller chose.
 */
describe.each([
    ['DatePicker', DatePicker, 'MMM Do YYYY'],
    ['TimePicker', TimePicker, 'HH:mm'],
    ['DateTimePicker', DateTimePicker, 'MMM Do YYYY, HH:mm'],
])('%s falsy format', (name, Picker, fallback) => {
    const VALUE = '2026-08-07T14:54:00.000Z';
    const displayed = (props) => {
        render(withAdapter(<Picker label="When" name="when" value={VALUE} onChange={() => {}} {...props} />));
        return document.querySelector('input').value;
    };

    test.each([
        ['null', null],
        ['an empty string', ''],
        ['undefined', undefined],
    ])('falls back to the v3 default when the format is %s', (label, format) => {
        const value = displayed({ format });

        expect(value).toBe(moment(VALUE).format(fallback));
        expect(value).not.toContain('T');
    });

    test('still lets a real format win', () => {
        expect(displayed({ format: 'DD.MM.YYYY' })).toBe(moment(VALUE).format('DD.MM.YYYY'));
    });
});

/*
 * v3 put a clear icon in the field itself when `clearable`, alongside the action bar's "Clear".
 * v8 has the same idea behind `slotProps.field.clearable`, but its field suppresses the adornment
 * on a read-only field — and the v3 modal field always is, so nothing rendered at all.
 */
describe.each([
    ['DatePicker', DatePicker],
    ['TimePicker', TimePicker],
    ['DateTimePicker', DateTimePicker],
])('%s clear adornment', (name, Picker) => {
    const VALUE = '2026-08-07T14:54:00.000Z';
    const renderPicker = (props) => {
        const onChange = jest.fn();
        render(withAdapter(<Picker label="When" name="when" value={VALUE} onChange={onChange} {...props} />));
        return { onChange, clear: () => screen.queryByRole('button', { name: /clear input/i }) };
    };

    test('renders a clear button in the field when clearable', () => {
        expect(renderPicker({ clearable: true }).clear()).toBeInTheDocument();
    });

    test('renders none when the picker is not clearable', () => {
        expect(renderPicker().clear()).not.toBeInTheDocument();
    });

    test('renders none on an empty field — there is nothing to clear', () => {
        const { clear } = renderPicker({ clearable: true, value: null });

        expect(clear()).not.toBeInTheDocument();
    });

    test('renders none when the picker is read-only or disabled', () => {
        expect(renderPicker({ clearable: true, readOnly: true }).clear()).not.toBeInTheDocument();
    });

    /*
     * The size the rest of the library draws a clear adornment at: `TextField`, `UploadFileField`,
     * `UploadFiles` and `DateTimePickerRange` all render `IconButton size="large"` around a
     * default-size `MdiIcon`, which is a 48px box holding a 24px icon, 24px in from the input's
     * right edge. platform-ui 1.x drew the picker's clear the same way — MUI v4's default `medium`
     * carried the same 12px padding — which is what the application still renders on staging.
     */
    test('draws the clear at the size every other field in the library uses', () => {
        const button = renderPicker({ clearable: true }).clear();

        expect(button).toHaveClass('MuiIconButton-sizeLarge');
        // `edge="end"` pulls the button 3px further right than an unedged one, which is what took
        // it out of line with the fields above and below it.
        expect(button).not.toHaveClass('MuiIconButton-edgeEnd');
        expect(button.querySelector('.mdi-close')).toHaveStyle({ fontSize: '24px', width: '24px', height: '24px' });
    });

    test('publishes an empty value and leaves the dialog shut', () => {
        const { onChange, clear } = renderPicker({ clearable: true });

        fireEvent.click(clear());

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target.value).toBeNull();
        // The field opens the picker on a click; clearing must not count as one.
        expect(document.querySelector('.MuiDialog-root')).not.toBeInTheDocument();
    });
});
