import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextField as MuiTextField, IconButton, Input, InputAdornment } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';

import MdiIcon from 'components/MdiIcon';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import { createEvent } from 'utils/http/event';
import { isDefined } from 'utils/utils';

// eslint-disable-next-line no-unused-vars
const { endAdornment, ...inputPropsSubSet } = Input.propTypes || {};

const useStyles = withStyles((theme) => ({
    icon: {
        color: theme.colors.darkGray,
    },
}));

class TextField extends PureComponent {
    static propTypes = {
        ...(MuiTextField || {}).propTypes,
        InputProps: PropTypes.shape(inputPropsSubSet),
    };

    static defaultProps = {
        variant: 'filled',
        margin: 'normal',
        fullWidth: true,
        InputProps: {},
    };

    @bind
    @memoize()
    onClear() {
        const { onChange, name, type } = this.props;
        const event = createEvent('change', { target: { name, type, value: null } });
        onChange && onChange(event);
    }

    @bind
    @memoize()
    getClearAdornment(disabled, value) {
        return (
            !disabled &&
            !!value && (
                <InputAdornment position="end">
                    <IconButton aria-label="Clear input" onClick={this.onClear}>
                        <Cancel className={this.props.classes.icon} />
                    </IconButton>
                </InputAdornment>
            )
        );
    }

    @bind
    @memoize()
    getErrorAdornment() {
        return (
            <InputAdornment position="end">
                <IconButton aria-label="Clear input" onClick={this.onClear}>
                    <MdiIcon name="alert-circle" color="error" />
                </IconButton>
            </InputAdornment>
        );
    }

    render() {
        const { disabled, value, InputProps, error, ...restProps } = this.props;
        return (
            <MuiTextField
                value={isDefined(value) ? value : ''}
                disabled={disabled}
                error={error}
                InputProps={{
                    endAdornment: error ? this.getErrorAdornment() : this.getClearAdornment(disabled, value),
                    ...InputProps,
                }}
                {...restProps}
            />
        );
    }
}

export default useStyles(TextField); // eslint-disable-line react-hooks/rules-of-hooks
