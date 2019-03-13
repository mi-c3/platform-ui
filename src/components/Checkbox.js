
import React from 'react';
import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Checkbox = ({ labelPlacement, label, ...restProps }) => (
    <FormControlLabel
        {...restProps}
        control={<MuiCheckbox />}
        labelPlacement={labelPlacement || 'end'}
        label={label}

    />
);

export default Checkbox;
