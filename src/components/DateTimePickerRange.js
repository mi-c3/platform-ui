import React, { PureComponent, Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/GridLegacy';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MuiTextField from '@mui/material/TextField';
import moment from 'moment';
import styled from 'styled-components';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import { isDefined } from 'utils/utils';
import { mergeSlotProps } from 'utils/pickers/pickerProps';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import Button from './Button';
import ModalDialog from './ModalDialog';
import Autocomplete from './Autocomplete';
import Switch from './Switch';
import DateTimePicker from './DateTimePicker';
import TextField from './TextField';
import MdiIcon from './MdiIcon';

const CustomInputStyled = styled(InputBase)`
    flex-grow: 1;
    margin-bottom: -10px;
`;

const EmptySpace = styled.div`
    margin-right: 4px;
`;

const SwitchStyled = styled(Switch)`
    margin-left: 0px;
`;

const CloseButtonIcon = styled(MdiIcon)`
    line-height: 11px !important;
`;

const ClearButtonWrapper = styled(Grid)`
    margin: 8px 0px;
`;

const CustomInput = ({ value, onClick, placeholder, disabled }) => (
    <CustomInputStyled disabled={disabled} placeholder={placeholder} value={value} onClick={onClick} />
);

CustomInput.propTypes = {
    value: PropTypes.any,
    onClick: PropTypes.func,
    placeholder: PropTypes.string,
};

const CalendarPickerIcon = () => <MdiIcon name="calendar-blank" />;

/*
 * v8 renders the field from the picker's own value, which while a dialog is open is whatever it was
 * seeded with — so an untouched picker would show today's date in the field. It also paints the
 * format as an editable mask ("DD, MMMM YYYY hh:mm") whenever the empty input holds focus, with no
 * prop to opt out (`useFieldV6TextField` keys off the active element). v3 did neither: the input
 * stayed empty until a value was actually chosen. So the field renders what the range has
 * committed, passed in as `displayValue`, rather than the value driving the dialog.
 */
const ModalPickerField = ({ displayValue, ...props }) => <MuiTextField {...props} value={displayValue ?? ''} />;

ModalPickerField.propTypes = {
    displayValue: PropTypes.string,
};

const MODAL_PICKER_FORMAT = 'DD, MMM YYYY HH:mm';
const formatPickerValue = (date) => (date ? moment(date).format(MODAL_PICKER_FORMAT) : '');

/*
 * v3 proportions for the modal picker, restored on top of MUI X v8's own. None of them are
 * configurable — they are constants inside `@mui/x-date-pickers` — so each is imposed with CSS.
 * The one v3 figure deliberately not restored is its 305px view box: v8's calendar fills its own
 * 336px exactly (a 56px header, a 40px weekday row and six 40px week rows), so reaching 305 meant
 * scaling the whole grid, which shrank the days below v3's 36px and inset the header arrows. Both
 * views therefore share v8's 336px, leaving the dialog a little taller than v3's.
 */
const V3_CLOCK_WIDTH = 260;
const V3_TOOLBAR_HEIGHT = 100;
// v3's calendar arrows were a default-padding IconButton (48px hit area, and so a 48px hover ring)
// around a small glyph; v8's are 40px around a 24px icon. Both figures are scaled off the 36px day
// cell in the v3 screenshots, so nudge them here if they read wrong.
const V3_ARROW_BUTTON_SIZE = 48;
const V3_ARROW_ICON_SIZE = 16;
const V8_VIEW_HEIGHT = 336;
const V8_CLOCK_WIDTH = 220;

// v3 modal pickers: a read-only field with the calendar icon as its only (leading) trigger, and
// a dialog with the date/time tabs plus a "Today"/"Cancel"/"OK" action bar.
const modalPickerSlots = { openPickerIcon: CalendarPickerIcon, textField: ModalPickerField };
const modalPickerSlotProps = {
    actionBar: { actions: ['today', 'cancel', 'accept'] },
    field: { readOnly: true, openPickerButtonPosition: 'start' },
    // v3's toolbar had no title; v8 defaults it to "Select date & time".
    toolbar: { toolbarTitle: '' },
    layout: {
        sx: (theme) => ({
            // Both views get the calendar's own height, so the dialog keeps one size across the
            // tabs. The calendar is left unscaled: squeezing it into v3's shorter 305px box meant
            // scaling it 0.907, which shrank the day cells below v3's 36px and inset the whole grid
            // — so the header arrows could never reach v3's 24px from the dialog edge.
            '& .MuiTimeClock-root': { height: V8_VIEW_HEIGHT },
            // The clock hand's geometry is computed from CLOCK_WIDTH, so a transform is the only
            // way to resize the face. Mouse input reads `offsetX`, which ignores the transform;
            // touch input derives its coordinates from getBoundingClientRect and does not.
            '& .MuiClock-root': {
                transform: `scale(${V3_CLOCK_WIDTH / V8_CLOCK_WIDTH})`,
                transformOrigin: 'top center',
            },
            // v3 kept "Today" hard left with Cancel/OK grouped on the right; MUI's DialogActions
            // pushes all three to the end.
            '& .MuiPickersLayout-actionBar > :first-of-type': { marginRight: 'auto' },
            // v3 gave the toolbar and the tabs their own background — `primary.main` on a light
            // theme, `background.default` on a dark one — which set them off from the paper below.
            // v8 leaves both transparent.
            '& .MuiPickersLayout-toolbar, & .MuiPickersLayout-tabs': {
                backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.background.default,
            },
            // v3 put the month/year between the two arrows; v8 groups both arrows to the right of
            // a left-aligned label. `display: contents` lifts them out of their own container so
            // they can be ordered around the label as flex items of the header.
            '& .MuiPickersCalendarHeader-root': {
                justifyContent: 'center',
                // v8 pads 24 left / 12 right, which insets each arrow by a different amount, and
                // pins the row to 40px — too short for a 48px button, so the hover ring is clipped.
                padding: 0,
                minHeight: V3_ARROW_BUTTON_SIZE,
                maxHeight: V3_ARROW_BUTTON_SIZE,
            },
            '& .MuiPickersCalendarHeader-labelContainer': { margin: '0 auto' },
            '& .MuiPickersArrowSwitcher-root': { display: 'contents' },
            '& .MuiPickersArrowSwitcher-spacer': { display: 'none' },
            '& .MuiPickersArrowSwitcher-previousIconButton': { order: -1 },
            '& .MuiPickersArrowSwitcher-nextIconButton': { order: 1 },
            // Padding rather than width/height, so the hover ring stays centred on the glyph. Given
            // in px because `sx` multiplies a bare number on `padding` by the theme spacing scale.
            '& .MuiPickersArrowSwitcher-button': {
                padding: `${(V3_ARROW_BUTTON_SIZE - V3_ARROW_ICON_SIZE) / 2}px`,
                // Drops the -12px that `edgeStart`/`edgeEnd` add, which shift the arrows once they
                // are reordered around the label. With the header unpadded they then sit flush to
                // each edge, putting their centres at v3's 24px.
                margin: 0,
                '& .MuiSvgIcon-root': { fontSize: V3_ARROW_ICON_SIZE },
            },
            // v3's toolbar was a fixed 100px; v8 sizes it to its content.
            '& .MuiPickersLayout-toolbar': { minHeight: V3_TOOLBAR_HEIGHT, boxSizing: 'border-box' },
            // The tabs sit on that background, so their icons are white — dimmed while inactive,
            // as v3 had them. v8 leaves MUI's default `textColor="primary"`, which paints the
            // selected icon `primary.main` instead, and `DateTimePickerTabs` forwards nothing but
            // `sx` to the `Tabs` it renders, so `textColor` cannot be passed. `!important` because
            // MUI's own `MuiTab-root` colour is injected after this and would otherwise win on
            // ordering. The blue indicator underneath stays.
            '& .MuiPickersLayout-tabs .MuiTab-root': {
                color: `${theme.palette.common.white} !important`,
                opacity: 0.54,
            },
            '& .MuiPickersLayout-tabs .MuiTab-root.Mui-selected': { opacity: 1 },
        }),
    },
};

// v8's mobile date-time picker picks the time from digital columns; v3 used the analog clock, and
// without a view switcher — picking the hour moves on to the minutes on its own.
const renderClockWithoutSwitcher = (props) => renderTimeViewClock({ ...props, showViewSwitcher: false });
const modalPickerViewRenderers = {
    hours: renderClockWithoutSwitcher,
    minutes: renderClockWithoutSwitcher,
    seconds: renderClockWithoutSwitcher,
};

// What v8's date-time picker defaults `views` to when the caller passes none.
const DEFAULT_PICKER_VIEWS = ['year', 'day', 'hours', 'minutes'];

const unitOptions = [
    { label: 'Minute(s)', value: 'm' },
    { label: 'Hour(s)', value: 'h' },
    { label: 'Day(s)', value: 'd' },
    { label: 'Month(s)', value: 'M' },
    { label: 'Year(s)', value: 'Y' },
];

const rangeOptions = [
    { label: 'Last', value: 'subtract' },
    { label: 'Next', value: 'add' },
];

const unitMap = {
    m: 'minute(s)',
    M: 'month(s)',
    d: 'day(s)',
    h: 'hour(s)',
    Y: 'year(s)',
};
const rangeMap = {
    subtract: 'Last',
    add: 'Next',
};

const defaultRelativeValue = (unit = 'm') => ({ relative: true, range: 'subtract', amount: 1, unit });

// `value` is an array of Dates or of date strings (see propTypes). Every path that puts one into
// state goes through here: `start`/`end` are compared with `getTime()`, which a string doesn't have.
// An end that isn't a usable date lands as `null` rather than as `new Date(null)` (the epoch) or
// `new Date(undefined)` (an Invalid Date) — both truthy, so both would read as a filled-in end and
// take a half range past the check in `onSave`.
const toDate = (value) => {
    const date = value && new Date(value);
    return date && !isNaN(date.getTime()) ? date : null;
};
const toDates = (value) => (Array.isArray(value) && [toDate(value[0]), toDate(value[1])]) || [null, null];

class DateTimePickerRange extends PureComponent {
    static propTypes = {
        ...(DateTimePicker || {}).propTypes,
        value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])),
        relative: PropTypes.boolean,
        defaultUnit: PropTypes.string,
    };

    static defaultProps = {
        variant: 'standard',
        relative: false,
        TextFieldProps: {},
        defaultUnit: 'm',
    };

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            ...this.getDefault(props),
        };
        // Bound once so `buildInputs` keeps memoizing on its arguments alone. `open` is controlled
        // so that clicking anywhere in the read-only field opens the picker, as v3 did — the
        // calendar button alone is v8's only trigger.
        this.fromPicker = this.buildPickerHandlers('start');
        this.toPicker = this.buildPickerHandlers('end');
    }

    componentDidUpdate(prevProps) {
        const { value, variant, relative: relativeProps } = this.props;
        const { relative: relativeState, showModal } = this.state;
        if (showModal) return; // Don't sync external value while user is actively editing
        let nextState = null;
        if (!relativeState && ['all', 'standard'].includes(variant) && prevProps.value !== value && (!value || Array.isArray(value))) {
            const [start, end] = toDates(value);
            nextState = {
                ...(nextState || {}),
                start,
                end,
                value,
                relative: relativeProps || false,
            };
        }
        if (relativeState && ['all', 'relative'].includes(variant) && prevProps.value !== value && (!value || typeof value === 'object')) {
            nextState = {
                ...(nextState || {}),
                value: value || null,
                relative: ['relative'].includes(variant) ? true : relativeProps || true,
                start: null,
                end: null,
            };
        }
        if (prevProps.variant !== variant) {
            nextState = {
                ...(nextState || {}),
                relative: ['standard'].includes(variant) ? false : relativeProps || relativeState,
                value: nextState?.value || null,
                start: null,
                end: null,
            };
        }
        if (nextState) {
            this.setState(nextState);
        }
    }

    @bind
    getDefault(props) {
        const [start, end] = toDates(props.value);
        let relative =
            props.value && props.value.relative
                ? true
                : props.value && Array.isArray(props.value)
              ? false // eslint-disable-line
              : !['standard'].includes(props.variant); // eslint-disable-line

        if (isDefined(props.relative) && !['standard', 'relative'].includes(props.variant)) {
            relative = props.relative ? !Array.isArray(props.value) : false;
        }

        return {
            start,
            end,
            value: props.value || null,
            errors: false,
            relative,
        };
    }

    @bind
    onClear(e) {
        e.stopPropagation();
        this.setState({ start: null, end: null, value: null }, this.onSave);
    }

    @bind
    onClearRelative() {
        this.setState({ start: null, end: null, value: null, errors: null });
    }

    @bind
    onSave() {
        const { name, onChange } = this.props;
        if (!onChange) {
            return;
        }
        const { value, start, end } = this.state;

        // Half a range is never savable — flag the empty end instead of writing `null` over
        // whatever range was already applied. Clearing both ends still saves as `null`.
        if (!!start !== !!end) {
            return this.setState({ errors: { dates: 'This field is required.' } });
        }

        const currentDate = new Date();
        const calculatedRelativeDate =
            value?.relative &&
            moment(currentDate)
                [value.range](value.amount, value.unit)
                .toDate();

        if (value?.relative && !value?.amount) {
            return this.setState({ errors: { amount: 'Amount is required.' } });
        }
        if (
            value?.relative &&
            value?.amount &&
            (isNaN(calculatedRelativeDate) ||
                moment('1970-01-01', 'YYYY-MM-DD').toDate() > calculatedRelativeDate ||
                moment('4821-12-26', 'YYYY-MM-DD').toDate() < calculatedRelativeDate)
        ) {
            return this.setState({ errors: { amount: 'Amount is out of range.' } });
        }
        onChange && onChange({ name, value, target: { name, value } });
        this.closeModal();
    }

    @bind
    onChange() {
        const { start, end } = this.state;
        const value = start && [start, end];
        this.setState({ value });
    }

    @bind
    onChangeRelative(evnt) {
        const { defaultUnit } = this.props;
        const { value } = this.state;
        const { target } = evnt;
        const nextState = {
            value:
                value && typeof value === 'object'
                    ? {
                          ...defaultRelativeValue(defaultUnit), // eslint-disable-line indent
                          ...value, // eslint-disable-line indent
                          [target.name]: target.value, // eslint-disable-line indent
                      } // eslint-disable-line indent
                    : { ...defaultRelativeValue(defaultUnit), [target.name]: target.value },
        };
        if (nextState.value.amount < 0) {
            nextState.value.amount = 1;
        }
        if (nextState.value.amount) {
            nextState.errors = null;
        }
        this.setState(nextState);
    }

    /*
     * A picker dialog is one edit, the way v3 treated it: it opens on "now" when its end of the
     * range is still empty, and Cancel leaves the range exactly as it was. v8 has no draft value
     * — the dialog renders what we pass as `value` and publishes every selection through
     * `onChange` — so the range is snapshotted on open and restored unless "OK" accepted it.
     */
    @bind
    buildPickerHandlers(key) {
        const onOpen = () => this.beginPickerEdit(key);
        return {
            onClick: onOpen,
            onOpen,
            onAccept: (value) => this.acceptPickerEdit(key, value),
            onClose: this.endPickerEdit,
        };
    }

    @bind
    beginPickerEdit(key) {
        // Clicking the calendar button hits both `onOpen` and the field's `onClick`; the snapshot
        // marks the edit as already open so the second call doesn't capture the seeded value.
        if (this.pickerSnapshot) {
            return;
        }
        const { start, end } = this.state;
        this.pickerSnapshot = { start, end };
        // The field keeps showing `pickerBaseline` — what the range held when the dialog opened —
        // for the whole edit, so neither the seeded "now" nor any selection made inside the dialog
        // reaches it before "OK". Empty stays empty.
        this.setState({
            openPicker: key,
            pickerBaseline: { start, end },
            pickerView: 'day',
            ...(this.state[key] ? {} : { [key]: moment().toDate() }),
        });
    }

    /*
     * v8 groups a date-time picker's views into two steps and refuses to advance across the
     * boundary on its own (`useViews` bails when `areViewsInSameStep` is false), expecting a "Next"
     * button in the action bar. v3 just moved on: pick a day and the time view opens, pick the hour
     * and the minutes follow. The steps are hardcoded inside `MobileDateTimePicker`, so the view is
     * driven from here instead — hours to minutes is within one step and still advances by itself.
     */
    @bind
    onPickerViewChange(pickerView) {
        this.setState({ pickerView });
    }

    @bind
    advancePickerView() {
        const { PickersFromProps, PickersToProps } = this.props;
        // Functional so it cannot clobber the view MUI moves to by itself: hours to minutes is
        // within one step, and that change races this one.
        this.setState((prev) => {
            if (!prev.openPicker || prev.pickerView !== 'day') {
                return null;
            }
            // `views` is passed through, so a caller can narrow it to a date-only picker that has
            // no time view to move on to. Advancing into one MUI was not given makes it warn
            // ('`view="hours"` is not a valid prop') and pins the picker on the date view.
            const { views = DEFAULT_PICKER_VIEWS } = (prev.openPicker === 'start' ? PickersFromProps : PickersToProps) || {};
            return views.includes('hours') ? { pickerView: 'hours' } : null;
        });
    }

    @bind
    acceptPickerEdit(key, value) {
        this.pickerSnapshot = null;
        const apply = key === 'start' ? this.onChangeStart : this.onChangeEnd;
        apply({ target: { value } });
    }

    @bind
    endPickerEdit() {
        const snapshot = this.pickerSnapshot;
        this.pickerSnapshot = null;
        this.setState({ openPicker: null, pickerBaseline: null, ...snapshot }, snapshot ? this.onChange : undefined);
    }

    // Emptying one end doesn't blank the other input — that date is the user's, not ours to
    // discard. The emitted value stays `null` while either end is missing (see `onChange`), and
    // Save reports it as a missing field.
    @bind
    onChangeStart({ target: { value } }) {
        let { end } = this.state;
        let start = value && new Date(value);
        if (start && !end) {
            end = new Date(start);
            end.setHours(23, 59, 59, 999);
        } else if (start && start.getTime() >= end.getTime()) {
            start = new Date(end.getTime());
        }
        start && start.setMilliseconds(0);
        this.setState({ start, end, value: [start, end], errors: null }, this.onChange);
        this.advancePickerView();
    }

    @bind
    onChangeEnd({ target: { value } }) {
        let { start } = this.state;
        let end = value && new Date(value);
        if (end && !start) {
            start = new Date(end);
            start.setHours(0, 0, 0, 0);
        } else if (end && start.getTime() >= end.getTime()) {
            end = new Date(start.getTime());
        }
        end && end.setMilliseconds(999);
        this.setState({ start, end, value: [start, end], errors: null }, this.onChange);
        this.advancePickerView();
    }

    @bind
    toggleRelative({ target: { value: checked } }) {
        const { value } = this.props;
        const nextState = { relative: checked, value: null, start: null, end: null, errors: null };
        if (checked && value && typeof value === 'object') {
            nextState.value = value;
        }
        if (!checked && value && Array.isArray(value)) {
            const [start, end] = toDates(value);
            nextState.value = value;
            nextState.start = start;
            nextState.end = end;
        }
        this.setState(nextState);
    }

    @bind
    openModal() {
        const { disabled, onOpen } = this.props;
        if (disabled) return;
        this.setState({ showModal: true, ...this.getDefault(this.props) });
        onOpen?.();
    }
    @bind
    closeModal() {
        this.setState({ showModal: false });
        this.props.onClose?.();
    }

    @bind
    @memoize()
    // Every argument is part of the `@memoize()` cache key: leaving one out shows up as a stale
    // dialog rather than as an error, so add to both the signature and the call site together.
    buildInputs(PickersToProps, PickersFromProps, start, end, disabled, isMobile, errors, openPicker, pickerBaseline, pickerView) {
        // Only ever one of the two is missing when `errors.dates` is set, so the message lands
        // on the field that has to be filled in.
        const missing = errors?.dates;
        // While its dialog is open, a field keeps showing what the range held when that dialog
        // opened — nothing, if it was empty. Selections only reach the input once "OK" accepts them.
        //
        // Merged over, rather than replaced by, whatever the caller passes: `slots.textField` is
        // what keeps the seeded value out of the input, and `slotProps.textField` carries both that
        // value and the click-to-open, so letting a caller's bag win outright blanks the field.
        const fieldSlots = (PickersProps) => ({ ...modalPickerSlots, ...PickersProps?.slots });
        const fieldSlotProps = (key, PickersProps, onClick, date) =>
            mergeSlotProps(
                {
                    ...modalPickerSlotProps,
                    textField: {
                        onClick,
                        // Frozen for BOTH ends while either dialog is open, not just the one being
                        // edited: picking a date auto-fills the opposite end, and that must not
                        // surface in its field before "OK" either.
                        displayValue: formatPickerValue(openPicker ? pickerBaseline?.[key] : date),
                    },
                },
                PickersProps?.slotProps
            );
        return (
            <Grid container wrap={isMobile ? 'wrap' : 'nowrap'}>
                <DateTimePicker
                    variant="dialog"
                    ampm={false}
                    label="From"
                    required
                    error={!!missing && !start}
                    helperText={missing && !start ? missing : undefined}
                    viewRenderers={modalPickerViewRenderers}
                    view={pickerView}
                    onViewChange={this.onPickerViewChange}
                    // v8 derives a placeholder from the format ("DD, MMMM YYYY hh:mm"); v3 showed none.
                    placeholder=""
                    // Single-input field: what the v3 modal rendered, and the only structure
                    // that honours the `placeholder` of PickersFromProps/PickersToProps.
                    enableAccessibleFieldDOMStructure={false}
                    {...PickersFromProps}
                    slots={fieldSlots(PickersFromProps)}
                    slotProps={fieldSlotProps('start', PickersFromProps, this.fromPicker.onClick, start)}
                    onOpen={this.fromPicker.onOpen}
                    onAccept={this.fromPicker.onAccept}
                    onClose={this.fromPicker.onClose}
                    open={openPicker === 'start'}
                    value={start}
                    format={MODAL_PICKER_FORMAT}
                    onChange={this.onChangeStart}
                    disabled={disabled}
                />
                {!isMobile && <EmptySpace />}
                <DateTimePicker
                    variant="dialog"
                    ampm={false}
                    label="To"
                    required
                    error={!!missing && !end}
                    helperText={missing && !end ? missing : undefined}
                    viewRenderers={modalPickerViewRenderers}
                    view={pickerView}
                    onViewChange={this.onPickerViewChange}
                    placeholder=""
                    enableAccessibleFieldDOMStructure={false}
                    {...PickersToProps}
                    slots={fieldSlots(PickersToProps)}
                    slotProps={fieldSlotProps('end', PickersToProps, this.toPicker.onClick, end)}
                    onOpen={this.toPicker.onOpen}
                    onAccept={this.toPicker.onAccept}
                    onClose={this.toPicker.onClose}
                    open={openPicker === 'end'}
                    value={end}
                    format={MODAL_PICKER_FORMAT}
                    onChange={this.onChangeEnd}
                    disabled={disabled}
                />
            </Grid>
        );
    }

    @bind
    buildInputsRelative(restProps, isMobile, disabled, value, errors) {
        return (
            <Grid container wrap={isMobile ? 'wrap' : 'nowrap'} justifyContent={isMobile ? 'flex-start' : 'space-around'}>
                <Autocomplete
                    error={!!errors?.range}
                    label="Range"
                    disabled={disabled}
                    required
                    name="range"
                    onChange={this.onChangeRelative}
                    options={rangeOptions}
                    valueField="value"
                    value={value ? value.range || null : null}
                    clearable={false}
                />
                {!isMobile && <EmptySpace />}
                <TextField
                    error={!!errors?.amount}
                    helperText={errors?.amount}
                    disabled={disabled}
                    required
                    name="amount"
                    label="Amount"
                    type="number"
                    onChange={this.onChangeRelative}
                    value={value ? value.amount || null : null}
                    clearable={false}
                />
                {!isMobile && <EmptySpace />}
                <Autocomplete
                    error={!!errors?.unit}
                    valueField="value"
                    label="Unit"
                    disabled={disabled}
                    required
                    name="unit"
                    onChange={this.onChangeRelative}
                    options={unitOptions}
                    value={value ? value.unit || null : null}
                    clearable={false}
                />
            </Grid>
        );
    }

    render() {
        const {
            PickersFromProps,
            PickersToProps,
            disabled,
            variant,
            isMobile,
            TextFieldProps,
            relative: rrelative, //eslint-disable-line
            defaultUnit, //eslint-disable-line
            ...restProps
        } = this.props;
        const { errors, start, end, relative, showModal, value, openPicker, pickerBaseline, pickerView = 'day' } = this.state;
        const oval = restProps.value;
        return (
            <Fragment>
                <TextField
                    multiline
                    maxRows={2}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdiIcon name="calendar-blank" />
                            </InputAdornment>
                        ),
                        endAdornment: !disabled && (
                            <InputAdornment position="end">
                                <IconButton aria-label="Clear input" onClick={this.onClear} size="large">
                                    <MdiIcon name="close" />
                                </IconButton>
                            </InputAdornment>
                        ),
                        inputComponent: (props) => <CustomInput {...props} />,
                        ...(TextFieldProps?.InputProps || {}),
                    }}
                    {...restProps}
                    {...TextFieldProps}
                    disabled={disabled}
                    onClick={this.openModal}
                    value={
                        oval
                            ? oval.relative
                                ? `${rangeMap[oval.range]} ${oval.amount} ${unitMap[oval.unit]}`
                                : `${moment(oval[0]).format('DD, MMM YYYY HH:mm')} - ${moment(oval[1]).format('DD, MMM YYYY HH:mm')}`
                            : ''
                    }
                />
                {showModal && (
                    <ModalDialog
                        onClose={this.closeModal}
                        title={restProps.label}
                        actions={
                            <>
                                <Button onClick={this.closeModal} variant="text">
                                    Cancel
                                </Button>
                                <Button onClick={this.onSave} variant="contained" color="primary">
                                    Save
                                </Button>
                            </>
                        }
                        footer={<Typography variant="caption">* All fields are required</Typography>}
                    >
                        {variant === 'all' && (
                            <SwitchStyled
                                disabled={disabled}
                                label="Relative time"
                                onChange={this.toggleRelative}
                                value={relative}
                            />
                        )}
                        {relative && this.buildInputsRelative(restProps, isMobile, disabled, value, errors)}
                        {!relative &&
                            this.buildInputs(
                                PickersToProps, PickersFromProps, start, end, disabled, isMobile, errors, openPicker, pickerBaseline, pickerView
                            )}
                        <ClearButtonWrapper container>
                            <Button
                                startIcon={<CloseButtonIcon name="close" size={16} />}
                                onClick={this.onClearRelative}
                                variant="outlined"
                                color="primary"
                            >
                                Clear
                            </Button>
                        </ClearButtonWrapper>
                    </ModalDialog>
                )}
            </Fragment>
        );
    }
}

export default memo(DateTimePickerRange);
