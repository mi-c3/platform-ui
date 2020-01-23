import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextField as MuiTextField, IconButton, Input, InputAdornment } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/styles';

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
        clearable: PropTypes.bool,
    };

    static defaultProps = {
        variant: 'filled',
        margin: 'normal',
        fullWidth: true,
        InputProps: {},
        clearable: true,
    };

    @bind
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
            this.isDefined(value) && (
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

    isDefined(value) {
        return isDefined(value) && value !== '';
    }

    render() {
        const { disabled, value, InputProps, error, clearable, ...restProps } = this.props;
        const defaultEndAdornment = error ? this.getErrorAdornment() : this.getClearAdornment(disabled, value);
        return (
            <MuiTextField
                value={this.isDefined(value) ? value : ''}
                disabled={disabled}
                error={error}
                InputProps={{
                    endAdornment: clearable ? defaultEndAdornment : undefined,
                    ...InputProps,
                }}
                {...restProps}
            />
        );
    }
}

export default useStyles(TextField); // eslint-disable-line react-hooks/rules-of-hooks
