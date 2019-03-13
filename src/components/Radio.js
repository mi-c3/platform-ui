
import React from 'react';
import MuiRadio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Radio = ({ labelPlacement, color, ...restProps }) => (
    <FormControlLabel
        {...restProps}
        control={<MuiRadio color={color} />}
        labelPlacement={labelPlacement || 'end'}
    />
);

Radio.defaultProps = {
    color: 'primary',
};

export default Radio;
