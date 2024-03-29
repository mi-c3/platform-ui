import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker as DTPMui } from '@material-ui/pickers';
import { IconButton, InputAdornment } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import MdiIcon from 'components/MdiIcon';
import { createEvent } from 'utils/http/event';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import { colors } from 'styles/theme';

const useStyles = withStyles(() => ({
    clearIcon: {
        color: colors.darkGray,
    },
}));

class DateTimePicker extends PureComponent {
    static propTypes = {
        ...(DTPMui || {}).propTypes,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        animateYearScrolling: true,
        inputVariant: 'filled',
        margin: 'normal',
        fullWidth: true,
        clearable: false,
    };

    @bind
    onChange(value) {
        const { onChange, name, type } = this.props;
        onChange && onChange(createEvent('change', { target: { name, value, type } }));
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
                        <MdiIcon name="close" className={this.props.classes.clearIcon} />
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
        const { showTodayButton, onClick, disabled, value, clearable, InputProps, classes, type, ...dateTimePickerProps } = this.props;
        return (
            <DTPMui
                {...dateTimePickerProps}
                disabled={disabled}
                value={value || null}
                clearable={clearable}
                showTodayButton={!clearable && showTodayButton}
                InputProps={{
                    endAdornment: clearable && this.getClearAdornment(disabled, value),
                    disableUnderline: true,
                    ...(InputProps || {}),
                }}
                onChange={this.onChange}
            />
        );
    }
}

export default useStyles(DateTimePicker); // eslint-disable-line react-hooks/rules-of-hooks
