import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { SwatchesPicker } from 'react-color';

import { Paper, FormControl, InputLabel, Input, InputAdornment } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Icon from '@material-ui/core/Icon';
import { materialColorPalette } from 'styles/palettes';
import { withStyles } from '@material-ui/core/styles';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import { DarkTheme } from 'styles/theme';

const styles = () => ({
    root: {
        padding: 4,
        minHeight: 56,
        background: `${DarkTheme.palette.background.fields} !important`,
        '& .MuiInputAdornment-positionStart': {
            position: 'relative',
            top: '-10px',
            left: '8px',
            cursor: 'pointer',
        },
    },
    label: {
        marginLeft: 38,
    },
    swatches: {
        width: '243px !important',
        position: 'absolute',
        '& > div div:nth-child(2)': {
            background: `${DarkTheme.palette.background.default} !important`,
        },
        '& > div div:nth-child(1) > div > span div:nth-child(1)': {
            fill: 'white !important',
        },
    },
    icon: {
        margin: '0 8px 0 0',
        borderRadius: '5rem',
    },
    wrapper: {
        width: '100%',
        marginTop: 16,
        marginBottom: 8,
    },
    borderWrapper: { position: 'relative' },
});

class ColorPicker extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        name: PropTypes.string,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        value: PropTypes.string,
        required: PropTypes.bool,
        disabled: PropTypes.bool,
        fontSize: PropTypes.string,
        labelPlacement: PropTypes.string,
        className: PropTypes.string,
        classes: PropTypes.object,
    };

    static defaultProps = {
        disabled: false,
        required: false,
    };

    constructor(props) {
        super(props);

        this.state = { displayColorPicker: false };
        if (!props.value) {
            this.onChange({ hex: this.defaultValue });
        }
    }

    defaultValue = '#00BCD4';
    defaultColors = [
        ['#066ab1', '#0779ca'],
        ['#FFFFFF', '#00a99d', '#066ab1', '#4FC3F7', '#81C784', '#FF8A65', '#FFC107', '#FF5722', '#c62828'],
    ];

    @bind
    onChange(value) {
        const { onChange, name } = this.props;
        if (onChange) {
            onChange(createEvent('change', { target: { name, value: (value || {}).hex } }));
        }
    }

    @bind
    handleSwatches() {
        this.setState((state) => ({ displayColorPicker: !state.displayColorPicker }));
    }

    render() {
        const { label, name, value, required, fontSize, classes, disabled, className, ...restProps } = this.props;
        const { displayColorPicker } = this.state;
        return (
            <div className={`${className || ''} ${classes.wrapper} ColorPicker-wrapper`}>
                <Paper component="form" className={classes.root}>
                    <FormControl required={required} onClick={this.handleSwatches} disabled={disabled}>
                        <InputLabel className={classes.label}>{label}</InputLabel>
                        <Input
                            id="input-with-icon-adornment"
                            startAdornment={
                                <InputAdornment position="start">
                                    <Icon
                                        fontSize={fontSize}
                                        style={{ backgroundColor: value || this.defaultValue }}
                                        name={'circle'}
                                        className={classes.icon}
                                    />
                                </InputAdornment>
                            }
                            value={value || this.defaultValue}
                            disableUnderline
                        />
                    </FormControl>
                </Paper>
                {!disabled && displayColorPicker && (
                    <div className={classes.borderWrapper}>
                        <ClickAwayListener onClickAway={this.handleSwatches}>
                            <SwatchesPicker
                                {...restProps}
                                name={name}
                                color={value || this.defaultValue}
                                colors={materialColorPalette || this.defaultColors}
                                onChange={this.onChange}
                                className={classes.swatches}
                            />
                        </ClickAwayListener>
                    </div>
                )}
            </div>
        );
    }
}

export default withStyles(styles)(ColorPicker);
