import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimePicker as TPMui } from '@mui/x-date-pickers/TimePicker';

import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import {
    createFieldStepGuard, createMomentValueCache, splitLegacyPickerProps, withDisabledUnderline, withStepGuard,
} from 'utils/pickers/pickerProps';

class TimePicker extends PureComponent {
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
        // A keyboard step past minTime/maxTime (or the date bounds) is dropped instead of
        // published — the clock cannot cross those bounds either.
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
            <TPMui
                {...pickerProps}
                value={this.toValue(value)}
                slots={slots}
                slotProps={slotProps}
                onChange={this.onChange}
            />
        );
    }
}

export default TimePicker;
