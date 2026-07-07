import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextField as MuiTextField, IconButton, Input, InputAdornment } from '@mui/material';
import styled, { css } from 'styled-components';

import MdiIcon from 'components/MdiIcon';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import { createEvent } from 'utils/http/event';
import { isDefined } from 'utils/utils';
import { colors } from 'styles/theme';
import { get } from 'utils/lo/lo';

// eslint-disable-next-line no-unused-vars
const { endAdornment, ...inputPropsSubSet } = Input.propTypes || {};

const ClearIcon = styled(MdiIcon)`
    color: ${colors.darkGray};
`;

const StyledTextField = styled(MuiTextField)`
    ${({ $labelMargin }) => $labelMargin && css`
        & .MuiInputLabel-root {
            margin-left: 28px;
        }
    `}
    ${({ $hasStartAdornment }) => $hasStartAdornment && css`
        & .MuiInputAdornment-filled.MuiInputAdornment-positionStart:not(.MuiInputAdornment-hiddenLabel) {
            margin-top: 0 !important;
        }
    `}
    ${({ $hideInput }) => $hideInput && css`
        & .MuiInputBase-input.Mui-disabled {
            visibility: hidden;
        }
    `}
`;

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
        return (!disabled &&
        this.isDefined(value) && (<InputAdornment position="end">
            <IconButton aria-label="Clear input" onClick={this.onClear} size="large">
                <ClearIcon name="close" />
            </IconButton>
        </InputAdornment>));
    }

    @bind
    @memoize()
    getErrorAdornment() {
        return (
            <InputAdornment position="end">
                <IconButton aria-label="Clear input" onClick={this.onClear} size="large">
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
            <StyledTextField
                value={this.isDefined(value) ? value : ''}
                disabled={disabled}
                error={error}
                InputLabelProps={InputLabelProps}
                InputProps={{
                    endAdornment: clearable ? defaultEndAdornment : undefined,
                    disableUnderline: true,
                    ...InputProps,
                }}
                className={className}
                $labelMargin={!!get(InputProps, 'startAdornment') && !autocompleteMultiple}
                $hasStartAdornment={!!get(InputProps, 'startAdornment')}
                $hideInput={!!hideInput}
                {...restProps}
            />
        );
    }
}

export default TextField;
