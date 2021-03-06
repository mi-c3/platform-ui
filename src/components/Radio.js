import React from 'react';
import PropTypes from 'prop-types';
import MuiRadio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Radio = ({ labelPlacement, color, RadioProps, ...restProps }) => (
    <FormControlLabel {...restProps} control={<MuiRadio color={color} {...RadioProps} />} labelPlacement={labelPlacement || 'end'} />
);

Radio.propTypes = {
    ...(MuiRadio || {}).propTypes,
    color: PropTypes.string,
    labelPlacement: PropTypes.string,
};

Radio.defaultProps = {
    color: 'primary',
};

export default Radio;
