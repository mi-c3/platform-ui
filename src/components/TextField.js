
import React, { PureComponent } from 'react';
import MuiTextField from '@material-ui/core/TextField';
import Cancel from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

import { createEvent } from 'utils/http/event';


class TextField extends PureComponent {

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

    render() {
        const { disabled, value, ...restProps } = this.props;
        return (
            <MuiTextField
                value={value || ''}
                disabled={disabled}
                InputProps={{
                    endAdornment: !disabled && !!value && (
                        <IconButton
                            aria-label="Clear input"
                            onClick={this.onClear}
                        >
                            <Cancel />
                        </IconButton>
                    ),
                }}
                {...restProps}
            />
        );
    }
}

export default TextField;
