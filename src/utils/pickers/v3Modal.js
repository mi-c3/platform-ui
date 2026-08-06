import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import moment from 'moment';
import { usePickerContext } from '@mui/x-date-pickers/hooks';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import MdiIcon from 'components/MdiIcon';

/*
 * The v3 modal picker, rebuilt on @mui/x-date-pickers v8.
 *
 * `@material-ui/pickers` v3 — what platform-ui 1.x rendered, and what the application still expects
 * — opened every picker in a modal: a read-only field that opens on a click anywhere in it, a
 * toolbar, date/time tabs, an analog clock, and a "Cancel"/"OK" action bar that is the ONLY thing
 * that commits a value. v8 replaced all of it with an inline popper over an editable section field
 * that publishes every selection immediately. Everything below puts v3's shape back; the commit
 * semantics live in the picker components, which hold the draft until the action bar accepts it.
 */

/*
 * v8 renders the field from the picker's own value, which while a dialog is open is whatever it was
 * seeded with — so an untouched picker would show today's date in the field. It also paints the
 * format as an editable mask ("DD, MMMM YYYY hh:mm") whenever the empty input holds focus, with no
 * prop to opt out (`useFieldV6TextField` keys off the active element). v3 did neither: the input
 * stayed empty until a value was actually chosen. So the field renders what the range has
 * committed, passed in as `displayValue`, rather than the value driving the dialog.
 */
export const ModalPickerField = ({ displayValue, ...props }) => <MuiTextField {...props} value={displayValue ?? ''} />;

ModalPickerField.propTypes = {
    displayValue: PropTypes.string,
};

export const CalendarPickerIcon = () => <MdiIcon name="calendar-blank" />;

/*
 * v3 proportions for the modal picker, restored on top of MUI X v8's own. None of them are
 * configurable — they are constants inside `@mui/x-date-pickers` — so each is imposed with CSS.
 * The one v3 figure deliberately not restored is its 305px view box: v8's calendar fills its own
 * 336px exactly (a 56px header, a 40px weekday row and six 40px week rows), so reaching 305 meant
 * scaling the whole grid, which shrank the days below v3's 36px and inset the header arrows. Both
 * views therefore share v8's 336px, leaving the dialog a little taller than v3's.
 */
const V3_CLOCK_WIDTH = 260;
// Measured on staging: a date-time toolbar is 100px (year, date, big time), a date-only one 77px.
const V3_TOOLBAR_HEIGHT = 100;
export const V3_DATE_TOOLBAR_HEIGHT = 77;
// v3's typography, also measured on staging. v8 uses its own scale and its theme's text.secondary
// (0.7 white on our dark theme) where v3 dimmed with 0.54, and gives the clock one size for both
// rings where v3 stepped the inner one down.
const V3_INACTIVE_TEXT = 0.54;
const V3_WEEKDAY_TEXT = 0.5;
const V3_WEEKDAY_ROW_HEIGHT = 20;
const V3_DAY_FONT_WEIGHT = 500;
const V3_DATE_TOOLBAR_FONT_SIZE = 32.39;
// v3's view box, which the dialog height follows: 48px header + 20px weekday row + six 36px week
// rows, and the clock in the same box so the dialog keeps one size across the tabs.
const V3_VIEW_HEIGHT = 305;
// v3 sized the two dialogs differently, and v8's calendar is a flat 320 wide whatever it holds.
export const V3_DATE_DIALOG_WIDTH = 310;
export const V3_DATE_TIME_DIALOG_WIDTH = 325;
const V3_DAY_SIZE = 36;
const V3_WEEK_ROWS = 6;
// v3's calendar arrows were a default-padding IconButton (48px hit area, and so a 48px hover ring)
// around a small glyph; v8's are 40px around a 24px icon. Both figures are scaled off the 36px day
// cell in the v3 screenshots, so nudge them here if they read wrong.
const V3_ARROW_BUTTON_SIZE = 48;
const V3_ARROW_ICON_SIZE = 16;
const V8_CLOCK_WIDTH = 220;

/**
 * v3's date toolbar: the year over the date, both of them buttons that switch the view. v8's
 * `DatePickerToolbar` renders the date alone, which loses the year — and with it the only way v3 had
 * of reaching the year view, since its calendar header carried no switch-to-year caret.
 *
 * The date-TIME toolbar needs none of this: v8's already renders a year button beside the date.
 */
const v3DateToolbarSx = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        boxSizing: 'border-box',
        // 6px, not v8's 16: the two lines are 28px and 38px tall, and v3's toolbar came to 77px.
        padding: '6px 24px',
    },
    // v3's toolbar buttons showed nothing of their own: no uppercase, no padding, no hover fill.
    button: {
        textTransform: 'none',
        padding: 0,
        minWidth: 0,
        color: 'inherit',
        '&:hover': { backgroundColor: 'transparent' },
    },
    // Measured on staging; v8's own h4 is 34px, which reads noticeably larger next to it.
    date: { fontSize: V3_DATE_TOOLBAR_FONT_SIZE, lineHeight: 1.17 },
};

export const V3DateToolbar = ({ toolbarFormat = 'ddd, MMM D', className }) => {
    const { value, view, setView } = usePickerContext();
    const selected = (target) => (view === target ? { 'data-selected': true } : {});
    const goToYear = () => setView('year');
    const goToDay = () => setView('day');
    return (
        <Box className={`MuiPickersToolbar-root ${className || ''}`.trim()} sx={v3DateToolbarSx.root}>
            <Button sx={v3DateToolbarSx.button} onClick={goToYear}>
                <Typography variant="subtitle1" className="MuiPickersToolbarText-root" {...selected('year')}>
                    {value ? moment(value).format('YYYY') : '––––'}
                </Typography>
            </Button>
            <Button sx={v3DateToolbarSx.button} onClick={goToDay}>
                <Typography variant="h4" className="MuiPickersToolbarText-root" sx={v3DateToolbarSx.date} {...selected('day')}>
                    {value ? moment(value).format(toolbarFormat) : '––'}
                </Typography>
            </Button>
        </Box>
    );
};

V3DateToolbar.propTypes = {
    className: PropTypes.string,
    toolbarFormat: PropTypes.string,
};

export const MODAL_PICKER_FORMAT = 'DD, MMM YYYY HH:mm';

/** v3's weekday header: "Sun", "Mon", ... — v8 narrows it to a single letter. */
export const v3DayOfWeekFormatter = (date) => moment(date).format('ddd');

/** Formats what the field shows. The picker's own `format` wins; each one passes its v3 default. */
export const formatPickerValue = (date, format = MODAL_PICKER_FORMAT) => (date ? moment(date).format(format) : '');

/**
 * v3 modal pickers: a read-only field, and a dialog with the date/time tabs plus an action bar.
 *
 * `openPickerIcon` is only asked for by the range modal, whose fields carry a leading calendar
 * button. A standalone picker has no icon of its own — v3 opened it from a click anywhere in the
 * field, which is what `slotProps.textField.onClick` does.
 */
export const v3ModalPickerSlots = ({ openPickerIcon = false } = {}) => ({
    textField: ModalPickerField,
    ...(openPickerIcon ? { openPickerIcon: CalendarPickerIcon } : {}),
});

const v3ModalPickerSlotPropsBase = {
    field: { readOnly: true },
    // v3's toolbar had no title; v8 defaults it to "Select date & time".
    toolbar: { toolbarTitle: '' },
};

const v3ModalLayoutSx = (theme) => ({
    // Both views take v3's box, so the dialog is v3's height and keeps one size across the tabs.
    // v8's calendar is 336: it spaces its week rows 40px apart (a 36px day with 2px margins). v3
    // stacked bare 36px rows, so the margins go rather than the cell size — scaling the grid down
    // instead shrinks the days below 36px and insets the header arrows away from v3's geometry.
    '& .MuiDateCalendar-root': { height: V3_VIEW_HEIGHT },
    '& .MuiDayCalendar-slideTransition': { minHeight: V3_DAY_SIZE * V3_WEEK_ROWS },
    '& .MuiDayCalendar-weekContainer, & .MuiPickersDay-root': { margin: 0 },
    // The clock sits in the same box, centred in it. The hand's geometry is computed from
    // CLOCK_WIDTH, so a transform is the only way to resize the face — and it scales from the
    // centre, or the face hugs the tabs above it and leaves all the slack underneath. Mouse input
    // reads `offsetX`, which ignores the transform; touch input derives its coordinates from
    // getBoundingClientRect and does not.
    '& .MuiTimeClock-root': {
        height: V3_VIEW_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    '& .MuiClock-root': {
        transform: `scale(${V3_CLOCK_WIDTH / V8_CLOCK_WIDTH})`,
        transformOrigin: 'center center',
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

    // v3 dimmed the toolbar segments it was not editing to 0.54 white, on both themes — the toolbar
    // has its own dark background. v8 uses its theme's text.secondary, which is 0.7 on a dark theme.
    '& .MuiPickersToolbar-root .MuiPickersToolbarText-root:not([data-selected])': {
        color: alpha(theme.palette.common.white, V3_INACTIVE_TEXT),
    },
    // v3's weekday row was half the height of a week row and dimmer than the days.
    '& .MuiDayCalendar-weekDayLabel': {
        height: V3_WEEKDAY_ROW_HEIGHT,
        color: alpha(theme.palette.common.white, V3_WEEKDAY_TEXT),
    },
    '& .MuiDayCalendar-header': { minHeight: V3_WEEKDAY_ROW_HEIGHT },
    // v3 set every day in medium; v8 only the selected one.
    '& .MuiPickersDay-root': { fontWeight: V3_DAY_FONT_WEIGHT },
    // v3's month label was regular weight, centred between the arrows.
    '& .MuiPickersCalendarHeader-label': { fontWeight: theme.typography.fontWeightRegular },
    // v3 dimmed the whole clock face but the selection. The SIZES are left alone: v8 already gives
    // the inner (13-00) ring `typography.body2` through an `isClockNumberInInnerRing` variant, which
    // is v3's 14px against the outer ring's 16px — and a `font-size` here would outrank that variant
    // (two classes against one) and flatten both rings to one size.
    '& .MuiClockNumber-root': { color: alpha(theme.palette.common.white, V3_WEEKDAY_TEXT) },
    '& .MuiClockNumber-root.Mui-selected': { color: theme.palette.common.white },
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
});

// v8's mobile date-time picker picks the time from digital columns; v3 used the analog clock, and
// without a view switcher — picking the hour moves on to the minutes on its own.
const renderClockWithoutSwitcher = (props) => renderTimeViewClock({ ...props, showViewSwitcher: false });
export const v3ModalPickerViewRenderers = {
    hours: renderClockWithoutSwitcher,
    minutes: renderClockWithoutSwitcher,
    seconds: renderClockWithoutSwitcher,
};

// What v8's date-time picker defaults `views` to when the caller passes none.

/**
 * The v3 modal slot props. `actions` differ per picker — v3 showed "Clear" only on a clearable
 * picker and "Today" only when asked for one — and the range modal wants the calendar icon as a
 * leading trigger where the standalone pickers have no icon at all: the whole field opens them.
 */
export const v3ModalPickerSlotProps = ({
    actions = ['cancel', 'accept'], openPickerButtonPosition, hideSwitchViewButton,
    toolbarHeight = V3_TOOLBAR_HEIGHT, dialogWidth = V3_DATE_TIME_DIALOG_WIDTH,
} = {}) => ({
    ...v3ModalPickerSlotPropsBase,
    actionBar: { actions },
    // The consuming application's theme puts a 320px min-width on every dialog paper, which leaves a
    // dead strip beside a narrower picker. Scoped to the picker's own dialog, not the theme.
    dialog: { sx: { '& .MuiDialog-paper': { minWidth: dialogWidth, width: dialogWidth } } },
    field: { ...v3ModalPickerSlotPropsBase.field, ...(openPickerButtonPosition ? { openPickerButtonPosition } : {}) },
    layout: {
        sx: (theme) => ({
            ...v3ModalLayoutSx(theme),
            // v3's toolbar was a fixed height per picker — 100px with a time, 77px without; v8 sizes
            // it to its content.
            '& .MuiPickersLayout-toolbar': { minHeight: toolbarHeight, boxSizing: 'border-box' },
            // The dialog takes its width from the layout, and v8's views are a flat 320 whatever the
            // picker holds. Each view gets the width in pixels, NOT `100%`: the year list is a
            // wrapping flex container, and a percentage of a content-sized parent leaves it nothing
            // to wrap against — it lays every year out in one row and the dialog grows to 19272px.
            width: dialogWidth,
            '& .MuiDateCalendar-root, & .MuiTimeClock-root, & .MuiYearCalendar-root': { width: dialogWidth },
            // v3's calendar header held nothing but the two arrows and the month label: the year view
            // was reached by clicking the year in the toolbar, so v8's switch-to-year caret beside the
            // label has no v3 counterpart. Only hidden where that year button exists — v8's date-time
            // toolbar has one, its date-only toolbar renders the date alone, and hiding the caret
            // there would leave no way to change the year at all.
            ...(hideSwitchViewButton ? { '& .MuiPickersCalendarHeader-switchViewButton': { display: 'none' } } : {}),
        }),
    },
});

/**
 * v3's action bar: "Clear" when the picker is clearable, "Today" when it was asked for, then
 * "Cancel"/"OK". Order matters — the layout pushes the first action hard left, as v3 did.
 */
export const v3ModalActions = ({ clearable, showTodayButton }) => [
    ...(clearable ? ['clear'] : []),
    ...(showTodayButton ? ['today'] : []),
    'cancel',
    'accept',
];
