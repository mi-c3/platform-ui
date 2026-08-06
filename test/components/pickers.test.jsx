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
 * v3's calendar header carried only the arrows and the month label — the year view was reached from a
 * year button in the toolbar. v8 has neither: it adds a switch-to-year caret beside the label, and its
 * date-only toolbar renders the date alone. Both are put back the v3 way.
 */
describe('the v3 calendar header and toolbar', () => {
    const VALUE = '2026-08-06T10:00:00.000Z';
    const open = (ui) => {
        render(withAdapter(ui));
        fireEvent.click(screen.getByRole('textbox'));
    };
    const caretHiddenByLayout = () => {
        // Keyed to THIS layout's own emotion class: the stylesheet is shared by every render in the
        // file, so a rule left behind by another picker would otherwise count. Asserted on the rule
        // rather than the computed style because jsdom's cascade ignores selector specificity.
        const layoutClass = Array.from(document.querySelector('.MuiPickersLayout-root').classList).find((name) => name.startsWith('css-'));
        return Array.from(document.styleSheets)
            .flatMap((sheet) => Array.from(sheet.cssRules || []))
            .some((rule) => (rule.cssText || '').includes(`.${layoutClass} .MuiPickersCalendarHeader-switchViewButton`) && /display: none/.test(rule.cssText));
    };
    const toolbarButtons = () => Array.from(document.querySelectorAll('.MuiPickersLayout-toolbar button')).map((button) => button.textContent);

    test('a date-time picker keeps v8\'s toolbar, which already has a year button', () => {
        open(<DateTimePicker label="When" value={VALUE} onChange={() => {}} />);

        expect(toolbarButtons()).toContain('2026');
        expect(caretHiddenByLayout()).toBe(true);
    });

    test('a date-only picker gets v3\'s year-over-date toolbar instead of v8\'s date alone', () => {
        open(<DatePicker label="When" value={VALUE} onChange={() => {}} />);

        expect(toolbarButtons()).toEqual(['2026', moment(VALUE).format('ddd, MMM D')]);
        expect(caretHiddenByLayout()).toBe(true);
    });

    test('the toolbar year opens the year view', () => {
        open(<DatePicker label="When" value={VALUE} onChange={() => {}} />);
        expect(document.querySelector('.MuiYearCalendar-root')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: '2026' }));

        expect(document.querySelector('.MuiYearCalendar-root')).toBeInTheDocument();
    });

    test('the weekday header uses v3\'s three-letter names, not v8\'s single letters', () => {
        open(<DatePicker label="When" value={VALUE} onChange={() => {}} />);

        const weekdays = Array.from(document.querySelectorAll('.MuiDayCalendar-weekDayLabel')).map((label) => label.textContent);
        expect(weekdays).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    });
});

/*
 * The typography, measured on staging (platform-ui 1.8.9 + @material-ui/pickers 3.2.10) and imposed
 * over v8's own scale. Asserted on the emitted rules: jsdom's cascade ignores selector specificity, so
 * a computed style there says nothing about what a browser paints.
 */
describe('the v3 typography', () => {
    const layoutRules = () => {
        const layoutClass = Array.from(document.querySelector('.MuiPickersLayout-root').classList).find((name) => name.startsWith('css-'));
        return Array.from(document.styleSheets)
            .flatMap((sheet) => Array.from(sheet.cssRules || []))
            .map((rule) => rule.cssText || '')
            .filter((text) => text.includes(`.${layoutClass} `));
    };
    const ruleFor = (selector) => layoutRules().find((text) => text.includes(selector));
    // Some selectors appear in more than one rule (a shared `margin: 0`, say), so a property has to
    // be looked for across all of them rather than in whichever comes first.
    const rulesFor = (selector) => layoutRules().filter((text) => text.includes(selector)).join(' ');

    beforeEach(() => {
        render(withAdapter(<DateTimePicker label="When" value={'2026-08-06T19:40:00.000Z'} onChange={() => {}} />));
        fireEvent.click(screen.getByRole('textbox'));
    });

    test('dims an unedited toolbar segment to 0.54 white, where v8 uses its own text.secondary', () => {
        expect(ruleFor('.MuiPickersToolbarText-root:not([data-selected])')).toMatch(/rgba\(255, 255, 255, 0\.54\)/);
    });

    test('halves the weekday row and dims it below the days', () => {
        const rule = ruleFor('.MuiDayCalendar-weekDayLabel');
        expect(rule).toMatch(/height: 20px/);
        expect(rule).toMatch(/rgba\(255, 255, 255, 0\.5\)/);
    });

    test('sets every day in medium, not only the selected one', () => {
        expect(rulesFor('.MuiPickersDay-root')).toMatch(/font-weight: 500/);
    });

    test('dims the clock face but the selection, and leaves both ring sizes to v8', () => {
        expect(ruleFor('.MuiClockNumber-root {')).toMatch(/rgba\(255, 255, 255, 0\.5\)/);
        expect(ruleFor('.MuiClockNumber-root.Mui-selected')).toMatch(/color: (#fff|rgb\(255, 255, 255\))/);
        // No font-size of ours: v8 sizes the inner ring through an `isClockNumberInInnerRing`
        // variant (body2, v3's 14px), and a rule here would outrank it and flatten both rings.
        expect(ruleFor('.MuiClockNumber-root {')).not.toMatch(/font-size/);
    });

    test('gives both views v3 box heights, so the dialog keeps one size across the tabs', () => {
        expect(ruleFor('.MuiDateCalendar-root')).toMatch(/height: 305px/);
        expect(ruleFor('.MuiTimeClock-root')).toMatch(/height: 305px/);
        // v8 spaces week rows 40px apart with day margins; v3 stacked bare 36px rows.
        expect(ruleFor('.MuiDayCalendar-slideTransition')).toMatch(/min-height: 216px/);
        expect(rulesFor('.MuiPickersDay-root')).toMatch(/margin: 0/);
    });

    test('scales the clock from its centre, so it does not hug the tabs', () => {
        expect(ruleFor('.MuiClock-root')).toMatch(/transform-origin: center center/);
    });

    test('gives the month label regular weight', () => {
        // `-label {` and not just `-label`, which also matches `-labelContainer`.
        expect(ruleFor('.MuiPickersCalendarHeader-label {')).toMatch(/font-weight: 400/);
    });
});

/*
 * v3 sized its two dialogs differently — 310 for a date, 325 with a time — where v8's calendar is a
 * flat 320 whatever the picker holds.
 */
describe('the v3 dialog width', () => {
    const widthRule = () => {
        const layout = document.querySelector('.MuiPickersLayout-root');
        const layoutClass = Array.from(layout.classList).find((name) => name.startsWith('css-'));
        return Array.from(document.styleSheets)
            .flatMap((sheet) => Array.from(sheet.cssRules || []))
            .map((rule) => rule.cssText || '')
            .find((text) => text.startsWith(`.${layoutClass} {`) || text.includes(`.${layoutClass} {`));
    };

    test('a date-only dialog is 310 wide', () => {
        render(withAdapter(<DatePicker label="When" value={'2026-08-06T10:00:00.000Z'} onChange={() => {}} />));
        fireEvent.click(screen.getByRole('textbox'));

        expect(widthRule()).toMatch(/width: 310px/);
    });

    test('a date-time dialog is 325 wide', () => {
        render(withAdapter(<DateTimePicker label="When" value={'2026-08-06T10:00:00.000Z'} onChange={() => {}} />));
        fireEvent.click(screen.getByRole('textbox'));

        expect(widthRule()).toMatch(/width: 325px/);
    });
});

/*
 * Regression: the views were given `width: 100%` to follow the dialog. The year list is a wrapping
 * flex container, so a percentage of a content-sized parent gave it nothing to wrap against — every
 * year landed in one row and the dialog blew out to 19272px.
 */
test('the year view stays inside the dialog width', () => {
    render(withAdapter(<DatePicker label="When" value={'2026-08-06T10:00:00.000Z'} onChange={() => {}} />));
    fireEvent.click(screen.getByRole('textbox'));
    fireEvent.click(screen.getByRole('button', { name: '2026' }));

    expect(document.querySelector('.MuiYearCalendar-root')).toBeInTheDocument();
    // On the emitted rule: jsdom's cascade ignores specificity, so v8's own one-class 320px rule
    // beats this two-class one there — the browser resolves it the other way.
    const layoutClass = Array.from(document.querySelector('.MuiPickersLayout-root').classList).find((name) => name.startsWith('css-'));
    const rule = Array.from(document.styleSheets)
        .flatMap((sheet) => Array.from(sheet.cssRules || []))
        .map((cssRule) => cssRule.cssText || '')
        .find((text) => text.includes(`.${layoutClass} .MuiYearCalendar-root`));
    expect(rule).toMatch(/width: 310px/);
    expect(rule).not.toMatch(/width: 100%/);
});
