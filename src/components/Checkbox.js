import React from 'react';
import PropTypes from 'prop-types';
import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/*
 * TODO: do we need to normalize onChange? check and implement if necessary.
 */
const Checkbox = ({ labelPlacement, label, ...restProps }) => (
    <FormControlLabel
        {...restProps}
        control={<MuiCheckbox />}
        labelPlacement={labelPlacement || 'end'}
        label={label}
    />
);

Checkbox.propTypes = {
    ...MuiCheckbox.propTypes,
    label: PropTypes.string,
    labelPlacement: PropTypes.string,
};

export default Checkbox;
