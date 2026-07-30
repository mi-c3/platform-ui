import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker as DPMui } from '@mui/x-date-pickers/DatePicker';

import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import { splitLegacyPickerProps, toMomentOrNull, withDisabledUnderline } from 'utils/pickers/pickerProps';

class DatePicker extends PureComponent {
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
        slotProps.textField = withDisabledUnderline(slotProps.textField);
        return (
            <DPMui
                {...pickerProps}
                value={toMomentOrNull(value)}
                slots={slots}
                slotProps={slotProps}
                onChange={this.onChange}
            />
        );
    }
}

export default DatePicker;
