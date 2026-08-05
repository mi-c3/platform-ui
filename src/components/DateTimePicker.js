import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker as DTPMui } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import {
    createFieldStepGuard, createMomentValueCache, splitLegacyPickerProps, withDisabledUnderline, withStepGuard,
} from 'utils/pickers/pickerProps';

class DateTimePicker extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
    };

    static defaultProps = {
        inputVariant: 'filled',
        margin: 'normal',
        fullWidth: true,
        clearable: false,
    };

    toValue = createMomentValueCache();

    stepGuard = createFieldStepGuard();

    @bind
    onChange(value, context) {
        // A keyboard step past minDate/maxDate is dropped instead of published — the calendar
        // cannot cross those bounds either.
        if (this.stepGuard.refuses(context)) {
            return;
        }
        const { onChange, name, type } = this.props;
        onChange && onChange(createEvent('change', { target: { name, value, type } }));
    }

    render() {
        // eslint-disable-next-line no-unused-vars
        const { onClick, value, onChange, type, variant, ...legacyProps } = this.props;
        // v3 `variant="dialog"` opened the picker in a modal with a toolbar, date/time tabs and
        // an action bar; that is v8's mobile picker. Anything else stays on the responsive one.
        const Picker = variant === 'dialog' ? MobileDateTimePicker : DTPMui;
        const { pickerProps, slots, slotProps } = splitLegacyPickerProps(legacyProps);
        slotProps.textField = withStepGuard(withDisabledUnderline(slotProps.textField), this.stepGuard);
        return (
            <Picker
                {...pickerProps}
                value={this.toValue(value)}
                slots={slots}
                slotProps={slotProps}
                onChange={this.onChange}
            />
        );
    }
}

export default DateTimePicker;
