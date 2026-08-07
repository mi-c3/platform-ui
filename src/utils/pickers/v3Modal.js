import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import MuiTextField from '@mui/material/TextField';
import moment from 'moment';
import { usePickerActionsContext, usePickerContext, usePickerTranslations } from '@mui/x-date-pickers/hooks';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import MdiIcon from 'components/MdiIcon';

/*
 * The v3 modal picker, rebuilt on @mui/x-date-pickers v8.
 *
 * `@material-ui/pickers` v3 — what platform-ui 1.x rendered, and what the application still expects
 * — opened every picker in a modal: a read-only field that opens on a click anywhere in it, a
 * toolbar, date/time tabs, an analog clock, and a "Cancel"/"OK" action bar that is the ONLY thing
 * that commits a value. v8 replaced that with an inline popper over an editable section field that
 * publishes every selection immediately.
 *
 * What is restored here is the INTERACTION, through v8's own props and slots: the mobile (modal)
 * pickers, a read-only field, the analog clock renderers, and an action bar that owns the commit.
 * v3's exact proportions and type scale are deliberately NOT restored — matching them meant a wall
 * of CSS against MUI's internal DOM (week-row margins, arrow reordering, clock scaling), which is
 * the first thing to break on a MUI upgrade and the last thing to tell us it has.
 */

/*
 * v8 renders the field from the picker's own value, which while a dialog is open is whatever it was
 * seeded with — so an untouched picker would show today's date in the field. It also paints the
 * format as an editable mask ("DD, MMMM YYYY hh:mm") whenever the empty input holds focus, with no
 * prop to opt out (`useFieldV6TextField` keys off the active element). v3 did neither: the input
 * stayed empty until a value was actually chosen. So the field renders what the consumer has
 * committed, passed in as `displayValue`, rather than the value driving the dialog.
 *
 * It also opens the picker, which is what made v3's field a trigger. v8 opens from its own
 * open-picker button instead, and the standalone pickers turn that button off.
 */
export const ModalPickerField = ({ displayValue, onClick, ...props }) => {
    const { setOpen } = usePickerActionsContext();
    const { disabled, readOnly } = usePickerContext();
    const handleClick = (event) => {
        onClick?.(event);
        if (!disabled && !readOnly) {
            setOpen(true);
        }
    };
    return <MuiTextField {...props} onClick={handleClick} value={displayValue ?? ''} />;
};

ModalPickerField.propTypes = {
    displayValue: PropTypes.string,
    onClick: PropTypes.func,
};

/**
 * The action bar, rendering v8's own actions but taking the accept for itself when the picker holds
 * a draft (`onAcceptValue`).
 *
 * v8 decides whether "OK" changed anything by comparing the value against `state.lastCommittedValue`
 * and skips `onAccept` when they match, so an untouched picker commits nothing — v3 committed the
 * date the dialog opened on, which is what the application expects from a field that seeds "now".
 * Owning the accept here also means the commit no longer rides on that internal comparison.
 */
export const V3ModalActionBar = ({ actions = [], onAcceptValue, className }) => {
    const { clearValue, setValueToToday, acceptValueChanges, cancelValueChanges } = usePickerActionsContext();
    const { value } = usePickerContext();
    const translations = usePickerTranslations();
    const handlers = {
        clear: () => {
            onAcceptValue?.(null);
            clearValue();
        },
        today: () => {
            onAcceptValue?.(moment());
            setValueToToday();
        },
        cancel: cancelValueChanges,
        accept: () => {
            onAcceptValue?.(value);
            acceptValueChanges();
        },
    };
    const labels = {
        clear: translations.clearButtonLabel,
        today: translations.todayButtonLabel,
        cancel: translations.cancelButtonLabel,
        accept: translations.okButtonLabel,
    };
    return (
        <DialogActions className={className}>
            {actions.filter((action) => handlers[action]).map((action) => (
                <Button key={action} onClick={handlers[action]}>{labels[action]}</Button>
            ))}
        </DialogActions>
    );
};

V3ModalActionBar.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.oneOf(['clear', 'today', 'cancel', 'accept'])),
    onAcceptValue: PropTypes.func,
    className: PropTypes.string,
};

const CalendarPickerIcon = () => <MdiIcon name="calendar-blank" />;

export const MODAL_PICKER_FORMAT = 'DD, MMM YYYY HH:mm';

/** v3's weekday header: "Sun", "Mon", ... — v8 narrows it to a single letter. */
export const v3DayOfWeekFormatter = (date) => moment(date).format('ddd');

/**
 * Formats what the field shows. The picker's own `format` wins; each one passes its v3 default.
 *
 * `||` rather than a default parameter, which only covers `undefined`: moment renders a FALSY format
 * as an ISO-8601 string, so a `null` reaching here puts "2026-08-07T19:54:00+05:00" in the field —
 * a time on a date picker, whatever the caller asked for. v3 defaulted with `||` and never showed it.
 */
export const formatPickerValue = (date, format) => (date ? moment(date).format(format || MODAL_PICKER_FORMAT) : '');

/**
 * v3 modal pickers: a read-only field, and a dialog with the date/time tabs plus an action bar.
 *
 * `openPickerIcon` is only asked for by the range modal, whose fields carry a leading calendar
 * button. A standalone picker has no icon of its own — v3 opened it from a click anywhere in the
 * field, which `ModalPickerField` does.
 */
export const v3ModalPickerSlots = ({ openPickerIcon = false } = {}) => ({
    textField: ModalPickerField,
    actionBar: V3ModalActionBar,
    ...(openPickerIcon ? { openPickerIcon: CalendarPickerIcon } : {}),
});

/**
 * The only styling kept from v3: the toolbar and the tabs take their own background — `primary.main`
 * on a light theme, `background.default` on a dark one — which set them off from the paper below,
 * where v8 leaves both transparent. The tab icons sit on that background, so they are white, dimmed
 * while inactive; `!important` because MUI's own `MuiTab-root` colour is injected after this, and
 * `DateTimePickerTabs` forwards nothing but `sx` to the `Tabs` it renders.
 */
const v3ModalLayoutSx = (theme) => ({
    '& .MuiPickersLayout-toolbar, & .MuiPickersLayout-tabs': {
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.background.default,
    },
    '& .MuiPickersLayout-tabs .MuiTab-root': {
        color: `${theme.palette.common.white} !important`,
        opacity: 0.54,
    },
    '& .MuiPickersLayout-tabs .MuiTab-root.Mui-selected': { opacity: 1 },
});

export const v3ModalPickerSlotProps = ({ actions = ['cancel', 'accept'], openPickerButtonPosition, onAcceptValue } = {}) => ({
    field: { readOnly: true, ...(openPickerButtonPosition ? { openPickerButtonPosition } : {}) },
    // v3's toolbar had no title; v8 defaults it to "Select date & time".
    toolbar: { toolbarTitle: '' },
    actionBar: { actions, onAcceptValue },
    layout: { sx: v3ModalLayoutSx },
});

/**
 * v3's action bar: "Clear" when the picker is clearable, "Today" when it was asked for, then
 * "Cancel"/"OK".
 */
export const v3ModalActions = ({ clearable, showTodayButton }) => [
    ...(clearable ? ['clear'] : []),
    ...(showTodayButton ? ['today'] : []),
    'cancel',
    'accept',
];

// v8's mobile date-time picker picks the time from digital columns; v3 used the analog clock, and
// without a view switcher — picking the hour moves on to the minutes on its own.
const renderClockWithoutSwitcher = (props) => renderTimeViewClock({ ...props, showViewSwitcher: false });
export const v3ModalPickerViewRenderers = {
    hours: renderClockWithoutSwitcher,
    minutes: renderClockWithoutSwitcher,
    seconds: renderClockWithoutSwitcher,
};
