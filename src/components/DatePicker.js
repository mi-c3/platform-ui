import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker as DPMui } from '@mui/x-date-pickers/DatePicker';

import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import {
    createFieldStepGuard, createMomentValueCache, splitLegacyPickerProps, withDisabledUnderline, withStepGuard,
} from 'utils/pickers/pickerProps';

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
        const { onClick, value, onChange, type, ...legacyProps } = this.props;
        const { pickerProps, slots, slotProps } = splitLegacyPickerProps(legacyProps);
        slotProps.textField = withStepGuard(withDisabledUnderline(slotProps.textField), this.stepGuard);
        return (
            <DPMui
                {...pickerProps}
                value={this.toValue(value)}
                slots={slots}
                slotProps={slotProps}
                onChange={this.onChange}
            />
        );
    }
}

export default DatePicker;
