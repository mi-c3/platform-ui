import React, { useCallback } from 'react';
import { DateTimePicker as DTPMui, InlineDateTimePicker as IDTPMui } from 'material-ui-pickers';

import { createEvent } from 'utils/http/event';

const DateTimePicker = ({
    label, value, ampm, inline, disabled, views, minDate, maxDate, name,
    helperText, disableFuture, disablePast, animateYearScrolling, adornmentPosition, clearable,
    InputAdornmentProps, mask, ...restProps,
}) => {
    const Component = inline ? IDTPMui : DTPMui;
    const onChange = useCallback((value) => {
        restProps.onChange && restProps.onChange(createEvent('change', { target: { name, value } }));
    }, [value]);
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
