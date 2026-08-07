import React from 'react';
import { DateTimePicker as DTPMui } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import { bind } from 'utils/decorators/decoratorUtils';
import { mergeSlotProps, splitLegacyPickerProps, withDisabledUnderline } from 'utils/pickers/pickerProps';
import V3ModalPickerBase from 'utils/pickers/V3ModalPickerBase';
import {
    formatPickerValue, v3DayOfWeekFormatter, v3ModalActions, v3ModalPickerSlotProps, v3ModalPickerSlots,
    v3ModalPickerViewRenderers,
} from 'utils/pickers/v3Modal';

// v3's date-time field: "Aug 6th 2026, 19:40". A caller's `format` wins over it.
const V3_DATE_TIME_FORMAT = 'MMM Do YYYY, HH:mm';

// What v8 defaults `views` to — needed to tell whether there is a time view to move on to.
const DEFAULT_VIEWS = ['year', 'day', 'hours', 'minutes'];

/**
 * The v3 date-time picker: a read-only field that opens a modal on a click anywhere in it, date and
 * time tabs over an analog clock, and selections that stay a draft until "OK" accepts them.
 * `keyboardInput` opts into v8's editable field in an inline popper instead.
 */
class DateTimePicker extends V3ModalPickerBase {
    firstView = 'day';

    /*
     * v8 groups a date-time picker's views into two steps and will not advance across the boundary
     * on its own (`useViews` bails when `areViewsInSameStep` is false), expecting a "Next" button in
     * the action bar. v3 just moved on: pick a day and the time view opens, pick the hour and the
     * minutes follow. The steps are hardcoded inside the mobile picker, so the day-to-hours move is
     * driven from here; hours to minutes is within one step and still advances by itself.
     */
    advanceView() {
        const { views = DEFAULT_VIEWS, view } = this.props;
        if (view !== undefined) {
            // A caller driving the view owns the order it moves in.
            return;
        }
        // Functional, so it cannot clobber the view MUI moves to by itself — that change races this
        // one. `views` is passed through, so a caller can narrow it to a picker with no time view.
        //
        // An untracked view counts as the day view: the picker opens on it, and a consumer that
        // remounts on open (the form designer changes the picker's `key` there) starts with nothing
        // tracked at all.
        this.setState((prev) => {
            const onDayView = prev.view === undefined || prev.view === 'day';
            return onDayView && views.includes('hours') ? { view: 'hours' } : null;
        });
    }

    @bind
    onDateChange(value) {
        this.onChange(value);
        if (this.holdsDraft) {
            this.advanceView();
        }
    }

    render() {
        const {
            // eslint-disable-next-line no-unused-vars
            onClick, value, onChange, onAccept, onClose, onViewChange, type, variant, keyboardInput, commitOn,
            showTodayButton, view, format = V3_DATE_TIME_FORMAT, ...legacyProps
        } = this.props;
        // Read, not destructured out: `splitLegacyPickerProps` needs it in the bag to map onto
        // `slotProps.field.clearable` (the field's own clear adornment), and v3 also put a "Clear"
        // in the action bar for a clearable picker.
        const { clearable } = this.props;
        const { pickerProps, slots, slotProps } = splitLegacyPickerProps(legacyProps);
        slotProps.textField = withDisabledUnderline(slotProps.textField);

        // v8's own picker, editable field and all, only when a caller asks for typing.
        if (keyboardInput) {
            return (
                <DTPMui
                    {...pickerProps}
                    format={format}
                    value={this.toValue(value)}
                    slots={slots}
                    slotProps={slotProps}
                    onChange={this.onChange}
                    onAccept={onAccept}
                    onClose={onClose}
                    onViewChange={onViewChange}
                />
            );
        }

        return (
            <MobileDateTimePicker
                format={format}
                // v8 derives a placeholder from the format ("MMM DD YYYY, hh:mm"); v3 showed none.
                placeholder=""
                dayOfWeekFormatter={v3DayOfWeekFormatter}
                // A single input is the v3 field, and the only structure ModalPickerField can be.
                enableAccessibleFieldDOMStructure={false}
                disableOpenPicker={!slots.openPickerIcon && !slots.openPickerButton}
                viewRenderers={v3ModalPickerViewRenderers}
                // A day click has to leave the dialog open to reach the time view, as v3 did.
                closeOnSelect={false}
                {...pickerProps}
                view={this.view}
                onViewChange={this.onViewChange}
                slots={{ ...v3ModalPickerSlots(), ...slots }}
                slotProps={mergeSlotProps(
                    {
                        ...v3ModalPickerSlotProps({
                            actions: v3ModalActions({ clearable, showTodayButton }),
                            onAcceptValue: this.holdsDraft ? this.acceptDraft : undefined,
                        }),
                        // The field shows what has been committed, never the draft: v8 renders it
                        // from the same value as the views, and v3's input only moved on "OK".
                        textField: { displayValue: formatPickerValue(this.toValue(value), format) },
                    },
                    slotProps
                )}
                value={this.pickerValue}
                onChange={this.onDateChange}
                onAccept={this.onAccept}
                onOpen={this.onOpen}
                onClose={this.onClose}
            />
        );
    }
}

export default DateTimePicker;
