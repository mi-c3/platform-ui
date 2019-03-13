import React from 'react';
import { TimePicker as TPMui, InlineTimePicker as ITPMui } from 'material-ui-pickers';

const TimePicker = ({
    label, value, onChange, ampm, inline, disabled, views, minDate, maxDate,
    helperText, disableFuture, disablePast, adornmentPosition, clearable,
    InputAdornmentProps, mask, showTodayButton, minutesStep, seconds
}) => {
    const Component = inline ? ITPMui : TPMui;
    return (
        <Component
            margin="normal"
            showTodayButton={showTodayButton}
            ampm={ampm}
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
            minutesStep={minutesStep}
            seconds={seconds}
        />
    );
};

TimePicker.defaultProps = {
    animateYearScrolling: true,
    ampm: false,
    inline: false,
};
TimePicker.displayName = 'TimePicker';
export default TimePicker;
