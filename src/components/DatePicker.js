
import React, { PureComponent } from 'react';
import { DatePicker as DPMui, InlineDatePicker as IDPMui } from 'material-ui-pickers';

import { createEvent } from 'utils/http/event';


class DatePicker extends PureComponent {

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
            InputAdornmentProps, mask, showTodayButton
        } = this.props;
        const Component = inline ? IDPMui : DPMui;
        return (
            <Component
                margin="normal"
                showTodayButton={showTodayButton}
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

export default DatePicker;
