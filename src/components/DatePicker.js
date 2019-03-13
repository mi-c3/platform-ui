import React from 'react';
import { DatePicker as DPMui, InlineDatePicker as IDPMui } from 'material-ui-pickers';

const DatePicker = ({
    label, value, onChange, ampm, inline, disabled, views, minDate, maxDate,
    helperText, disableFuture, disablePast, animateYearScrolling, adornmentPosition, clearable,
    InputAdornmentProps, mask, showTodayButton
}) => {
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

DatePicker.defaultProps = {
    animateYearScrolling: true,
    ampm: false,
    inline: false,
};
DatePicker.displayName = 'DatePicker';
export default DatePicker;
