import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker as DTPMui, InlineDateTimePicker as IDTPMui } from 'material-ui-pickers';
import { IconButton, InputAdornment } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';

import { createEvent } from 'utils/http/event';
import { bind, memoize } from 'utils/decorators/decoratorUtils';

const useStyles = withStyles((theme) => ({
    icon: {
        color: theme.colors.darkGray,
    },
}));

class DateTimePicker extends PureComponent {
    static propTypes = {
        ...(DTPMui || {}).propTypes,
        inline: PropTypes.bool,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        animateYearScrolling: true,
        inline: false,
        variant: 'filled',
        margin: 'normal',
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
                        <Cancel className={this.props.classes.icon} />
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
        const { inline, onClick, disabled, value, clearable, InputProps, ...dateTimePickerProps } = this.props;
        const Component = inline ? IDTPMui : DTPMui;
        return (
            <Component
                {...dateTimePickerProps}
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

export default useStyles(DateTimePicker);
