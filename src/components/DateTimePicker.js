import React, { PureComponent } from 'react';
import { DateTimePicker as DTPMui, InlineDateTimePicker as IDTPMui } from 'material-ui-pickers';

import { createEvent } from 'utils/http/event';


class DateTimePicker extends PureComponent {

    static defaultProps = {
        animateYearScrolling: true,
        ampm: false,
        inline: false,
    }

    onChange = (value) => {
        const { onChange } = this.props;
        onChange && onChange(createEvent('change', { target: { name, value } }));
    }

    render() {
        const {
            label, value, ampm, inline, disabled, views, minDate, maxDate,
            helperText, disableFuture, disablePast, animateYearScrolling, adornmentPosition, clearable,
            InputAdornmentProps, mask
        } = this.props;
        const Component = inline ? IDTPMui : DTPMui;
        return (
            <Component
                margin="normal"
                animateYearScrolling={animateYearScrolling}
                ampm={ampm.toString()}
                views={views}
                label={label}
                value={value}
                onChange={this.onChange}
                disabled={disabled}
                minDate={minDate}
                maxDate={maxDate}
                helperText={helperText}
                disableFuture={disableFuture}
                disablePast={disablePast}
                adornmentPosition={adornmentPosition}
                clearable={clearable}
                InputAdornmentProps={InputAdornmentProps}
                maks={mask}
            />
        );
    }
}

export default DateTimePicker;
