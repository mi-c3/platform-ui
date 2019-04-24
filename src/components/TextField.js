import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextField as MuiTextField, IconButton, Input } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';

import { createEvent } from 'utils/http/event';

// eslint-disable-next-line no-unused-vars
const { endAdornment, ...inputPropsSubSet } = Input.propTypes || {};

class TextField extends PureComponent {

    static propTypes = {
        ...MuiTextField.propTypes,
        InputProps: PropTypes.shape(inputPropsSubSet),
    };

    static defaultProps = {
        variant: 'filled',
        margin: 'normal',
        fullWidth: true,
    }

    onClear = () => {
        const { onChange, name, type } = this.props;
        const event = createEvent('change', { target: { name, type, value: null, }});
        onChange && onChange(event);
    }

    endAdornment = (
        <IconButton
            aria-label="Clear input"
            onClick={this.onClear}
        >
            <Cancel />
        </IconButton>
    )

    render() {
        const { disabled, value, InputProps, ...restProps } = this.props;
        return (
            <MuiTextField
                value={value || ''}
                disabled={disabled}
                InputProps={{
                    endAdornment: !disabled && !!value && this.endAdornment,
                    ...InputProps,
                }}
                {...restProps}
            />
        );
    }
}

export default TextField;
