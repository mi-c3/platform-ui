import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker as DTPMui } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import { splitLegacyPickerProps, toMomentOrNull, withDisabledUnderline } from 'utils/pickers/pickerProps';

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

    @bind
    onChange(value) {
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
        slotProps.textField = withDisabledUnderline(slotProps.textField);
        return (
            <Picker
                {...pickerProps}
                value={toMomentOrNull(value)}
                slots={slots}
                slotProps={slotProps}
                onChange={this.onChange}
            />
        );
    }
}

export default DateTimePicker;
