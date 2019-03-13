import React from 'react';
import { DateTimePicker as DTPMui, InlineDateTimePicker as IDTPMui } from 'material-ui-pickers';

const DateTimePicker = ({
    label, value, onChange, ampm, inline, disabled, views, minDate, maxDate,
    helperText, disableFuture, disablePast, animateYearScrolling, adornmentPosition, clearable,
    InputAdornmentProps, mask
}) => {
    const Component = inline ? IDTPMui : DTPMui;
    return (
        <Component
            margin="normal"
            animateYearScrolling={animateYearScrolling}
            ampm={ampm.toString()}
            views={views}
            label={label}
            value={value}
            onChange={onChange}
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
};

DateTimePicker.defaultProps = {
    animateYearScrolling: true,
    ampm: false,
    inline: false,
};

export default DateTimePicker;
