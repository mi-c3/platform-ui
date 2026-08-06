import React from 'react';
import PropTypes from 'prop-types';
import MuiTextField from '@mui/material/TextField';
import moment from 'moment';
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

export const MODAL_PICKER_FORMAT = 'DD, MMM YYYY HH:mm';

/** Formats what the field shows. The picker's own `format` wins; each one passes its v3 default. */
export const formatPickerValue = (date, format = MODAL_PICKER_FORMAT) => (date ? moment(date).format(format) : '');

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
export const v3ModalPickerSlotProps = ({ actions = ['cancel', 'accept'], openPickerButtonPosition, hideSwitchViewButton } = {}) => ({
    ...v3ModalPickerSlotPropsBase,
    actionBar: { actions },
    field: { ...v3ModalPickerSlotPropsBase.field, ...(openPickerButtonPosition ? { openPickerButtonPosition } : {}) },
    layout: {
        sx: (theme) => ({
            ...v3ModalLayoutSx(theme),
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
