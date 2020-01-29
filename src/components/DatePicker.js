import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker as DPMui } from '@material-ui/pickers';
import { IconButton, InputAdornment } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/styles';

import { createEvent } from 'utils/http/event';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import { colors } from 'styles/theme';

const useStyles = withStyles(() => ({
    root: {
        color: colors.darkGray,
    },
}));

class DatePicker extends PureComponent {
    static propTypes = {
        ...(DPMui || {}).propTypes,
        inline: PropTypes.bool,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        animateYearScrolling: true,
        inline: false,
        variant: 'filled',
        margin: 'normal',
        fullWidth: true,
        clearable: false,
    };

    @bind
    onChange(value) {
        const { onChange, name } = this.props;
        onChange && onChange(createEvent('change', { target: { name, value } }));
    }

    @bind
    onClear(e) {
        e.stopPropagation();
        this.onChange(null);
    }

    @bind
    @memoize()
    getClearAdornment(disabled, value) {
        return (
            !disabled &&
            !!value && (
                <InputAdornment position="end">
                    <IconButton aria-label="Clear input" onClick={this.onClear}>
                        <Cancel className={this.props.classes.root} />
                    </IconButton>
                </InputAdornment>
            )
        );
    }

    render() {
        /*
         * WARNING: We need to avoid passing the onClick function because it will break the Component.
         * TODO: open a bug in the material-ui-pickers project.
         */
        // eslint-disable-next-line no-unused-vars
        const { onClick, clearable, disabled, value, InputProps, classes, ...datePickerProps } = this.props;
        return (
            <DPMui
                {...datePickerProps}
                disabled={disabled}
                value={value}
                clearable={clearable}
                InputProps={{
                    endAdornment: clearable && this.getClearAdornment(disabled, value),
                    ...(InputProps || {}),
                }}
                onChange={this.onChange}
            />
        );
    }
}

export default useStyles(DatePicker); // eslint-disable-line react-hooks/rules-of-hooks
