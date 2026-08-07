import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import moment from 'moment';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePickerRange } from '../../src';

const renderRange = (props) =>
    render(
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePickerRange label="Last updated" name="lastUpdated" variant="all" onChange={() => {}} {...props} />
        </LocalizationProvider>
    );

const openModal = () => fireEvent.click(screen.getByRole('textbox'));

// Each modal picker renders a single-input field, labelled by the picker's own label. Queried by
// label rather than by role because an open picker dialog aria-hides the modal behind it.
const getPickerField = (name) => screen.getByLabelText(new RegExp(`^${name}`));

// The field is read-only: the calendar icon in front of it is the only way into the picker.
const openPicker = (index) => fireEvent.click(screen.queryAllByRole('button', { name: /choose date/i })[index]);

// jsdom's computed style does not resolve every property (negative margins among them), so some
// rules have to be read back off the stylesheet instead.
const cssFor = (className) =>
    Array.from(document.styleSheets)
        .flatMap((sheet) => Array.from(sheet.cssRules || []))
        .map((rule) => rule.cssText || '')
        .filter((text) => text.includes(className))
        .join(' ');

// Scoped to the picker dialog: the range modal has a "Cancel" of its own.
const pickerAction = (label) => {
    const buttons = Array.from(document.querySelectorAll('.MuiPickersLayout-actionBar button'));
    const button = buttons.find((candidate) => candidate.textContent === label);
    // Named explicitly: clicking `undefined` would fail on a TypeError instead of on the label.
    expect(buttons.map((candidate) => candidate.textContent)).toContain(label);
    fireEvent.click(button);
};

test('renders the From/To pickers when the modal opens in absolute mode', () => {
    renderRange();
    openModal();
    expect(getPickerField('From')).toBeInTheDocument();
    expect(getPickerField('To')).toBeInTheDocument();
});

test('applies the placeholder of PickersFromProps/PickersToProps to the modal pickers', () => {
    renderRange({ PickersFromProps: { placeholder: 'start date' }, PickersToProps: { placeholder: 'end date' } });
    openModal();
    expect(getPickerField('From')).toHaveAttribute('placeholder', 'start date');
    expect(getPickerField('To')).toHaveAttribute('placeholder', 'end date');
});

test('renders the From/To pickers after "Relative time" is switched off', () => {
    // A relative value opens the modal in relative mode, as an applied relative filter does.
    renderRange({ relative: true, value: { relative: true, range: 'subtract', amount: 5, unit: 'd' } });
    openModal();
    expect(screen.getByLabelText(/Amount/)).toBeInTheDocument();

    // Regression: the pickers used to be rendered through a `TextFieldComponent` slot that
    // renders a plain <input />, which throws under the v8 accessible field DOM structure
    // ('The `sectionListRef` prop has not been initialized by `PickersSectionList`').
    fireEvent.click(screen.getByLabelText('Relative time'));

    expect(screen.queryByLabelText(/Amount/)).not.toBeInTheDocument();
    expect(getPickerField('From')).toBeInTheDocument();
    expect(getPickerField('To')).toBeInTheDocument();
});

describe('the modal pickers', () => {
    test('are read-only fields opened by their leading calendar button', () => {
        renderRange({ variant: 'standard' });
        openModal();

        expect(getPickerField('From')).toHaveAttribute('readonly');
        expect(screen.queryAllByRole('button', { name: /choose date/i })).toHaveLength(2);
    });

    test('open a dialog with the date/time tabs and a Today/Cancel/OK action bar', () => {
        renderRange({ variant: 'standard' });
        openModal();
        openPicker(0);

        expect(screen.getByRole('tab', { name: 'pick date' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'pick time' })).toBeInTheDocument();
        const actions = Array.from(document.querySelectorAll('.MuiPickersLayout-actionBar button'));
        expect(actions.map((button) => button.textContent)).toEqual(['Today', 'Cancel', 'OK']);
    });

    test('keep the v3 toolbar and analog clock rather than the v8 defaults', () => {
        renderRange({ variant: 'standard' });
        openModal();
        openPicker(0);

        // v8 titles the toolbar "Select date & time"; v3 showed the value alone.
        expect(screen.queryByText(/Select date & time/i)).not.toBeInTheDocument();
        expect(document.querySelector('.MuiPickersToolbar-root')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('tab', { name: 'pick time' }));

        expect(document.querySelector('.MuiTimeClock-root')).toBeInTheDocument();
        expect(document.querySelector('.MuiMultiSectionDigitalClock-root')).not.toBeInTheDocument();
    });

    test('carry no placeholder, the way v3 did', () => {
        renderRange({ variant: 'standard' });
        openModal();

        // v8 derives one from the format, e.g. "DD, MMMM YYYY hh:mm".
        expect(getPickerField('From')).toHaveAttribute('placeholder', '');
        expect(getPickerField('To')).toHaveAttribute('placeholder', '');
    });

    test('keep working when the caller passes slots/slotProps of its own', () => {
        // Regression: these used to be applied before `PickersFromProps`, so a caller's bag
        // replaced them outright — which dropped `displayValue` and blanked a field that had a
        // value, took the custom field slot away (letting the seeded date and the mask back in),
        // and lost the click-to-open riding on `slotProps.textField.onClick`.
        renderRange({
            variant: 'standard',
            value: ['2026-01-05T10:30:00.000Z', '2026-01-09T10:30:00.000Z'],
            PickersFromProps: { slotProps: { textField: { helperText: 'mine' } } },
        });
        openModal();

        expect(getPickerField('From').value).not.toBe('');
        expect(screen.getByText('mine')).toBeInTheDocument();

        fireEvent.click(getPickerField('From'));
        expect(document.querySelector('.MuiPickersLayout-root')).toBeInTheDocument();
    });

    test('open from a click anywhere in the field, not just the calendar button', () => {
        renderRange({ variant: 'standard' });
        openModal();

        fireEvent.click(getPickerField('To'));
        expect(document.querySelector('.MuiPickersLayout-root')).toBeInTheDocument();

        // The dialog runs on its seeded "now", but neither field shows anything for it: v8 would
        // render the field from that same value, v3 left the input alone until a value was chosen.
        expect(getPickerField('From')).toHaveValue('');
        expect(getPickerField('To')).toHaveValue('');

        // Accepting is a choice, so now it lands — proving it was the "To" picker that opened.
        pickerAction('OK');
        expect(getPickerField('To').value).not.toBe('');
    });

    test('set the toolbar and tabs off from the paper, as v3 did', () => {
        // v8 leaves both transparent, so the dialog reads as one flat block.
        const theme = createTheme({ palette: { mode: 'dark', background: { default: '#1a2337', paper: '#28334b' } } });
        render(
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePickerRange label="Last updated" name="lastUpdated" variant="standard" onChange={() => {}} />
                </LocalizationProvider>
            </ThemeProvider>
        );
        openModal();
        openPicker(0);

        const background = (selector) => getComputedStyle(document.querySelector(selector)).backgroundColor;
        expect(background('.MuiPickersLayout-toolbar')).toBe('rgb(26, 35, 55)');
        expect(background('.MuiPickersLayout-tabs')).toBe('rgb(26, 35, 55)');
        expect(background('.MuiDialog-paper')).toBe('rgb(40, 51, 75)');
    });

    test('drop the time view switcher and keep both views the same height', () => {
        renderRange({ variant: 'standard' });
        openModal();
        openPicker(0);
        fireEvent.click(screen.getByRole('tab', { name: 'pick time' }));

        // v3 advanced from hours to minutes on its own; v8 adds prev/next arrows for it.
        expect(screen.queryByRole('button', { name: /open (previous|next) view/i })).not.toBeInTheDocument();
        expect(document.querySelector('.MuiPickersArrowSwitcher-root')).not.toBeInTheDocument();
    });

    test('move on to the time view once a day is picked', () => {
        renderRange({ variant: 'standard' });
        openModal();
        openPicker(0);
        expect(screen.getByRole('tab', { name: 'pick date' })).toHaveAttribute('aria-selected', 'true');

        fireEvent.click(screen.getByRole('gridcell', { name: '15' }));

        // v8 puts the date and time views in separate steps and waits for a "Next" button;
        // v3 moved straight on, so the view is driven from the component.
        expect(screen.getByRole('tab', { name: 'pick time' })).toHaveAttribute('aria-selected', 'true');
        expect(document.querySelector('.MuiTimeClock-root')).toBeInTheDocument();
        expect(document.querySelector('.MuiDateCalendar-root')).not.toBeInTheDocument();
    });

    test('stay on the date view when the caller narrowed `views` past the clock', () => {
        // Regression: the move on to the time view was unconditional, so a date-only picker was
        // pushed into a view it had not been given — MUI warned ('`view="hours"` is not a valid
        // prop. It must be an element of `views=[...]`') and the picker stuck on the date view.
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        renderRange({ variant: 'standard', PickersFromProps: { views: ['year', 'month', 'day'] } });
        openModal();
        openPicker(0);

        fireEvent.click(screen.getByRole('gridcell', { name: '15' }));

        expect(warn.mock.calls.flat().join(' ')).not.toContain('is not a valid prop');
        expect(document.querySelector('.MuiDateCalendar-root')).toBeInTheDocument();
        warn.mockRestore();
    });

    test('still honour the view changes the picker makes itself', () => {
        // Driving the view from outside must not pin it: hours to minutes is MUI's own transition.
        renderRange({ variant: 'standard' });
        openModal();
        openPicker(0);

        fireEvent.click(screen.getByRole('button', { name: /switch to year view/i }));

        expect(document.querySelector('.MuiYearCalendar-root')).toBeInTheDocument();
    });

    test('paint the tab icons white, dimming the inactive one', () => {
        renderRange({ variant: 'standard' });
        openModal();
        openPicker(0);

        // v8 leaves MUI's `textColor="primary"`, so the selected icon comes out blue. jsdom
        // resolves `color` by injection order rather than by `!important`, so the rule is read back
        // off the stylesheet; the opacity half of it does land, so the selector is known to match.
        // Read off the stylesheet rather than from computed style: jsdom resolves `color` by
        // injection order rather than by `!important`, and asserting a computed `opacity` would
        // pass silently if a future MUI version started setting one of its own.
        expect(cssFor('MuiPickersLayout-tabs .MuiTab-root')).toContain('color: #fff !important');
        expect(cssFor('MuiPickersLayout-tabs .MuiTab-root')).toContain('opacity: 0.54');
        expect(cssFor('MuiTab-root.Mui-selected')).toContain('opacity: 1');
    });

    // v3 opened an empty picker on "now" and treated Cancel as discarding the whole edit.
    describe('opening one on an empty end', () => {
        const nowStamps = (formatValue) => {
            const before = moment();
            return () => [before, moment()].map(formatValue);
        };

        test('shows nothing in the field until the picker is opened', () => {
            renderRange({ variant: 'standard' });
            openModal();

            expect(getPickerField('From')).toHaveValue('');
            expect(getPickerField('To')).toHaveValue('');
        });

        test('opens the dialog on the current date and time', () => {
            const accepted = nowStamps((at) => at.format('YYYYMMMDHH:mm'));
            renderRange({ variant: 'standard' });
            openModal();
            openPicker(0);

            const toolbar = document.querySelector('.MuiPickersToolbar-root').textContent.replace(/\s/g, '');
            expect(accepted()).toContain(toolbar);
        });

        test('carries the current time onto a date picked without visiting the clock tab', () => {
            const accepted = nowStamps((at) => at.date(15).format('DD, MMM YYYY HH:mm'));
            renderRange({ variant: 'standard' });
            openModal();
            openPicker(0);
            fireEvent.click(screen.getByRole('gridcell', { name: '15' }));
            fireEvent.click(screen.getByText('OK'));

            expect(accepted()).toContain(getPickerField('From').value);
        });

        test('keeps every selection out of the field until "OK" accepts it', () => {
            renderRange({ variant: 'standard' });
            openModal();
            openPicker(0);

            fireEvent.click(screen.getByRole('gridcell', { name: '15' }));
            // The dialog has moved on to the time view, so a date is picked — but the input still
            // shows what the range held when it opened, which is nothing.
            expect(screen.getByRole('tab', { name: 'pick time' })).toHaveAttribute('aria-selected', 'true');
            expect(getPickerField('From')).toHaveValue('');
            // And nor does "To", which that pick auto-filled with the end of the same day.
            expect(getPickerField('To')).toHaveValue('');

            pickerAction('OK');

            expect(getPickerField('From').value).not.toBe('');
            expect(getPickerField('To').value).not.toBe('');
        });

        test('keeps the previous value in the field while it is being edited', () => {
            renderRange({ value: ['2026-01-05T10:30:00.000Z', '2026-01-09T10:30:00.000Z'] });
            openModal();
            const before = getPickerField('From').value;
            openPicker(0);

            fireEvent.click(screen.getByRole('gridcell', { name: '15' }));

            expect(getPickerField('From')).toHaveValue(before);
        });

        test('leaves the range untouched when the dialog is cancelled', () => {
            renderRange({ variant: 'standard' });
            openModal();
            openPicker(0);
            fireEvent.click(screen.getByRole('gridcell', { name: '15' }));
            pickerAction('Cancel');

            // Both the seeded "now" and the end auto-filled from the picked date are rolled back.
            expect(getPickerField('From')).toHaveValue('');
            expect(getPickerField('To')).toHaveValue('');
        });
    });

    test('fill both ends of the range from a single picked date', () => {
        const onChange = jest.fn();
        renderRange({ variant: 'standard', onChange });
        openModal();
        openPicker(0);
        fireEvent.click(screen.getByRole('gridcell', { name: '15' }));
        fireEvent.click(screen.getByText('OK'));
        fireEvent.click(screen.getByText('Save'));

        // The picked day, its time taken from "now", paired with the end of that same day.
        const [start, end] = onChange.mock.calls[0][0].target.value;
        expect(moment(start).date()).toBe(15);
        expect(moment(end).format('DD HH:mm:ss.SSS')).toBe(`${moment(start).format('DD')} 23:59:59.999`);
    });
});

test('keeps the pickers usable on a string range after "Relative time" is switched off', () => {
    // A range arrives from the outside as ISO strings. Switching the mode off used to put them
    // into state raw, so the next pick threw `end.getTime is not a function`.
    renderRange({ value: ['2026-01-05T10:30:00.000Z', '2026-01-09T10:30:00.000Z'] });
    openModal();
    fireEvent.click(screen.getByLabelText('Relative time'));
    fireEvent.click(screen.getByLabelText('Relative time'));

    openPicker(0);
    fireEvent.click(screen.getByRole('gridcell', { name: '15' }));
    pickerAction('OK');

    // The picked day is after the end of the range, so "From" is clamped to it — as it is for a
    // range that came in as Dates.
    expect(getPickerField('From').value).toBe(getPickerField('To').value);
});

describe('saving a partly filled range', () => {
    const range = ['2026-01-05T10:30:00.000Z', '2026-01-09T10:30:00.000Z'];
    // The pickers always fill both ends, so half a range only ever arrives from the outside.
    const halfRange = ['2026-01-05T10:30:00.000Z'];

    // An end can be missing by being absent from the array or by being empty in it. Regression:
    // only the first was caught, because every element went through `new Date()` — which turns
    // `null` into the epoch and `undefined` into an Invalid Date, both truthy, so the range read
    // as complete and saved with a 1970 (or unformattable) end.
    describe.each([
        ['is absent from the array', halfRange, 'To'],
        ['is null', [null, range[1]], 'From'],
        ['is undefined', [undefined, range[1]], 'From'],
        ['is null on the other end', [range[0], null], 'To'],
    ])('with an end that %s', (name, value, empty) => {
        test('refuses to save, and flags the empty end', () => {
            const onChange = jest.fn();
            renderRange({ value, onChange });
            openModal();

            expect(getPickerField(empty)).toHaveValue('');

            fireEvent.click(screen.getByText('Save'));

            expect(onChange).not.toHaveBeenCalled();
            expect(screen.getByText('This field is required.')).toBeInTheDocument();
        });
    });

    test('drops the error once the range is cleared altogether', () => {
        renderRange({ value: halfRange });
        openModal();
        fireEvent.click(screen.getByText('Save'));
        expect(screen.getByText('This field is required.')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Clear'));

        expect(screen.queryByText('This field is required.')).not.toBeInTheDocument();
    });

    test('saves null once both ends are cleared', () => {
        const onChange = jest.fn();
        renderRange({ value: range, onChange });
        openModal();

        fireEvent.click(screen.getByText('Clear'));
        fireEvent.click(screen.getByText('Save'));

        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: { name: 'lastUpdated', value: null } }));
    });
});
