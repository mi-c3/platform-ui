
import React, { useCallback } from 'react';
import MuiSwitch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { createEvent } from 'utils/http/event';

const Switch = ({ labelPlacement, color, value,  ...restProps }) => {
    const onChange = useCallback((event) => {
        const { name, checked } = event.target;
        restProps.onChange && restProps.onChange(createEvent('change', { target: { name, value: checked, checked } }));
    }, [value]);
    return (
        <FormControlLabel
            {...restProps}
            checked={value || false}
            onChange={onChange}
            control={<MuiSwitch color={color} />}
            labelPlacement={labelPlacement || 'end'}
        />
    );
};

Switch.defaultProps = {
    color: 'primary',
};

export default Switch;
