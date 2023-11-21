import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextField as MuiTextField, IconButton, Input, InputAdornment } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import MdiIcon from 'components/MdiIcon';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import { createEvent } from 'utils/http/event';
import { isDefined } from 'utils/utils';
import { colors } from 'styles/theme';
import { get } from 'utils/lo/lo';

// eslint-disable-next-line no-unused-vars
const { endAdornment, ...inputPropsSubSet } = Input.propTypes || {};

const useStyles = withStyles(() => ({
    clearIcon: {
        color: colors.darkGray,
    },
    labelMargin: {
        marginLeft: 28,
    },
    fieldProps: {
        '& .MuiInputAdornment-filled.MuiInputAdornment-positionStart:not(.MuiInputAdornment-hiddenLabel)': {
            marginTop: '0 !important',
        },
    },
    hiddenInput: {
        '& .MuiInputBase-input.Mui-disabled': {
            display: 'none',
        },
    },
}));

class TextField extends PureComponent {
    static propTypes = {
        ...(MuiTextField || {}).propTypes,
        InputProps: PropTypes.shape(inputPropsSubSet),
        clearable: PropTypes.bool,
        autocompleteMultiple: PropTypes.bool,
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
                        <MdiIcon name="close" className={this.props.classes.clearIcon} />
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
        // eslint-disable-next-line no-unused-vars
        const {
            className,
            disabled,
            value,
            InputProps,
            InputLabelProps,
            error,
            clearable,
            classes,
            autocompleteMultiple,
            hideInput,
            ...restProps
        } = this.props;
        const defaultEndAdornment = error ? this.getErrorAdornment() : this.getClearAdornment(disabled, value);
        return (
            <MuiTextField
                value={this.isDefined(value) ? value : ''}
                disabled={disabled}
                error={error}
                InputLabelProps={{
                    ...InputLabelProps,
                    className: `${get(InputProps, 'startAdornment') && !autocompleteMultiple ? classes.labelMargin : ''} ${get(
                        InputLabelProps,
                        'className',
                        ''
                    )}`,
                }}
                InputProps={{
                    endAdornment: clearable ? defaultEndAdornment : undefined,
                    disableUnderline: true,
                    ...InputProps,
                }}
                className={`
                    ${hideInput ? classes.hiddenInput : ''} ${className} 
                    ${get(InputProps, 'startAdornment') ? classes.fieldProps : ''}
                `}
                {...restProps}
            />
        );
    }
}

export default useStyles(TextField); // eslint-disable-line react-hooks/rules-of-hooks
