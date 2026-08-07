import React from 'react';
import { DatePicker as DPMui } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { mergeSlotProps, splitLegacyPickerProps, withDisabledUnderline } from 'utils/pickers/pickerProps';
import V3ModalPickerBase from 'utils/pickers/V3ModalPickerBase';
import { formatPickerValue, v3DayOfWeekFormatter, v3ModalActions, v3ModalPickerSlotProps, v3ModalPickerSlots } from 'utils/pickers/v3Modal';

// v3's date field: "Aug 6th 2026". A caller's `format` wins over it.
const V3_DATE_FORMAT = 'MMM Do YYYY';

/**
 * The v3 date picker: a read-only field that opens a modal on a click anywhere in it, and a selection
 * that stays a draft until "OK" accepts it. `keyboardInput` opts into v8's editable field in an
 * inline popper instead.
 */
class DatePicker extends V3ModalPickerBase {
    firstView = 'day';

    render() {
        const {
            // eslint-disable-next-line no-unused-vars
            onClick, value, onChange, onAccept, onClose, onViewChange, type, variant, keyboardInput, commitOn,
            showTodayButton, view, format = V3_DATE_FORMAT, ...legacyProps
        } = this.props;
        // Read, not destructured out: `splitLegacyPickerProps` needs it in the bag to map onto
        // `slotProps.field.clearable` (the field's own clear adornment), and v3 also put a "Clear"
        // in the action bar for a clearable picker.
        const { clearable } = this.props;
        const { pickerProps, slots, slotProps } = splitLegacyPickerProps(legacyProps);
        slotProps.textField = withDisabledUnderline(slotProps.textField);

        if (keyboardInput) {
            return (
                <DPMui
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
            <MobileDatePicker
                format={format}
                placeholder=""
                dayOfWeekFormatter={v3DayOfWeekFormatter}
                enableAccessibleFieldDOMStructure={false}
                // v3's standalone fields carried no trigger of their own — the field WAS the trigger.
                // A caller that wants one (the range modal keeps its leading calendar button) supplies
                // an open-picker slot, and then it stays.
                disableOpenPicker={!slots.openPickerIcon && !slots.openPickerButton}
                // v3 kept the dialog open on a day click: the value was not committed yet, so the
                // user could still change their mind, or the month, before accepting.
                closeOnSelect={false}
                {...pickerProps}
                view={this.view}
                onViewChange={this.onViewChange}
                slots={{ ...v3ModalPickerSlots(), ...slots }}
                slotProps={mergeSlotProps(
                    {
                        ...v3ModalPickerSlotProps({ actions: v3ModalActions({ clearable, showTodayButton }) }),
                        // The field shows what has been committed, never the draft: v8 renders it from
                        // the same value as the views, and v3's input only moved on "OK".
                        textField: { displayValue: formatPickerValue(this.toValue(value), format) },
                    },
                    slotProps
                )}
                value={this.pickerValue}
                onChange={this.onChange}
                onAccept={this.onAccept}
                onClose={this.onClose}
            />
        );
    }
}

export default DatePicker;
