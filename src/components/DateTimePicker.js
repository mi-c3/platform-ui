import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker as DTPMui } from '@mui/x-date-pickers/DateTimePicker';

import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import { splitLegacyPickerProps, toMomentOrNull } from 'utils/pickers/pickerProps';

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
        const { onClick, value, onChange, type, ...legacyProps } = this.props;
        const { pickerProps, slots, slotProps } = splitLegacyPickerProps(legacyProps);
        if (!slotProps.textField.InputProps || slotProps.textField.InputProps.disableUnderline === undefined) {
            slotProps.textField.InputProps = { disableUnderline: true, ...(slotProps.textField.InputProps || {}) };
        }
        return (
            <DTPMui
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
