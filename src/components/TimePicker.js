import React from 'react';
import { TimePicker as TPMui } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import { mergeSlotProps, splitLegacyPickerProps, withDisabledUnderline } from 'utils/pickers/pickerProps';
import V3ModalPickerBase from 'utils/pickers/V3ModalPickerBase';
import {
    formatPickerValue, v3ModalActions, v3ModalPickerSlotProps, v3ModalPickerSlots, v3ModalPickerViewRenderers,
} from 'utils/pickers/v3Modal';

// v3's time field. A caller's `format` wins over it; `ampm` is passed through to the picker, so a
// 12-hour caller should set both, exactly as it had to under v3.
const V3_TIME_FORMAT = 'HH:mm';

/**
 * The v3 time picker: a read-only field that opens a modal on a click anywhere in it, an analog clock
 * whose hour selection moves on to the minutes, and a selection that stays a draft until "OK"
 * accepts it. `keyboardInput` opts into v8's editable field in an inline popper instead.
 */
class TimePicker extends V3ModalPickerBase {
    firstView = 'hours';

    render() {
        const {
            // eslint-disable-next-line no-unused-vars
            onClick, value, onChange, onAccept, onClose, onOpen, onViewChange, type, variant, keyboardInput, commitOn, open,
            showTodayButton, view, format = V3_TIME_FORMAT, ...legacyProps
        } = this.props;
        const { clearable } = this.props;
        const { pickerProps, slots, slotProps } = splitLegacyPickerProps(legacyProps);
        slotProps.textField = withDisabledUnderline(slotProps.textField);

        if (keyboardInput) {
            return (
                <TPMui
                    {...pickerProps}
                    format={format}
                    value={this.toValue(value)}
                    slots={slots}
                    slotProps={slotProps}
                    onChange={this.onChange}
                    onAccept={onAccept}
                    onClose={onClose}
                    onOpen={onOpen}
                    onViewChange={onViewChange}
                />
            );
        }

        return (
            <MobileTimePicker
                format={format}
                placeholder=""
                enableAccessibleFieldDOMStructure={false}
                // v3's standalone fields carried no trigger of their own — the field WAS the
                // trigger. A caller that wants one (the range modal keeps its leading calendar
                // button) supplies an open-picker slot, and then it stays.
                disableOpenPicker={!slots.openPickerIcon && !slots.openPickerButton}
                // The analog clock, without v8's prev/next view switcher: picking the hour moves on
                // to the minutes by itself, as v3 did.
                viewRenderers={v3ModalPickerViewRenderers}
                closeOnSelect={false}
                {...pickerProps}
                open={this.open}
                view={this.view}
                onViewChange={this.onViewChange}
                slots={{ ...v3ModalPickerSlots(), ...slots }}
                slotProps={mergeSlotProps(
                    {
                        ...v3ModalPickerSlotProps({ actions: v3ModalActions({ clearable, showTodayButton }) }),
                        textField: {
                            onClick: this.onOpen,
                            displayValue: formatPickerValue(this.toValue(value), format),
                        },
                    },
                    slotProps
                )}
                value={this.pickerValue}
                onChange={this.onChange}
                onAccept={this.onAccept}
                onClose={this.onClose}
                onOpen={this.onOpen}
            />
        );
    }
}

export default TimePicker;
