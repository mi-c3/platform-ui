
import React from 'react';
import MuiSwitch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Switch = ({ labelPlacement, color, ...restProps }) => (
    <FormControlLabel
        {...restProps}
        control={<MuiSwitch color={color} />}
        labelPlacement={labelPlacement || 'end'}
    />
);

Switch.defaultProps = {
    color: 'primary',
};

export default Switch;
