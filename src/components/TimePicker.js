import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

import { TimePicker as TPMui, InlineTimePicker as ITPMui } from 'material-ui-pickers';

// TODO: convert this component as class and implement the onChange as in the DatePicker component.
const TimePicker = (props) => {
    /*
     * WARNING: We need to avoid passing the onClick function because it will break the Component.
     * TODO: open a bug in the material-ui-pickers project.
     */
    // eslint-disable-next-line no-unused-vars
    const { inline, onClick, children, ...muiTimePickerProps } = props;
    const Component = inline ? ITPMui : TPMui;
    return (
        <Component margin="normal" {...muiTimePickerProps}>
            {children}
        </Component>
    );
};

// eslint-disable-next-line no-unused-vars
const { onClick, ...timePickerProps } = {
    ...TextField.propTypes,
    ...TPMui.propsTypes,
    inline: PropTypes.bool,
    value: PropTypes.object,
};

TimePicker.propTypes = timePickerProps;

TimePicker.defaultProps = {
    ampm: false,
    inline: false,
    children: null,
};

export default TimePicker;
