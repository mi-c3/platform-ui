import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { SwatchesPicker } from 'react-color';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import { materialColorPalette } from 'styles/palettes';
import { withStyles } from '@material-ui/core/styles';
import { createEvent } from 'utils/http/event';

const styles = (theme) => ({
    swatches: {
        width: '243px !important',
        '& > div div:nth-child(2)': {
            background: `${theme.palette.background.default} !important`,
        },
        '& > div div:nth-child(1) > div > span div:nth-child(1)': {
            fill: 'white !important',
        },
    },
    icon: {
        margin: '0 8px 0 0',
        borderRadius: '1rem',
    },
    controlLabel: {
        margin: '8px 0',
    },
});

class ColorPicker extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        name: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.string,
        required: PropTypes.bool,
        disabled: PropTypes.bool,
        size: PropTypes.number,
        labelPlacement: PropTypes.string,
        classes: PropTypes.object,
    };

    static defaultProps = {
        disabled: false,
        required: false,
    };

    constructor(props: Object) {
        super(props);

        this.state = { displayColorPicker: false };
    }

    defaultValue = '#00BCD4';
    defaultColors = [
        ['#066ab1', '#0779ca'],
        ['#FFFFFF', '#00a99d', '#066ab1', '#4FC3F7', '#81C784', '#FF8A65', '#FFC107', '#FF5722', '#c62828'],
    ];

    onChange = (value: Object) => {
        const { onChange, name } = this.props;
        if (onChange) {
            onChange(createEvent('change', { target: { name, value: (value || {}).hex } }));
        }
    };

    handleSwatches = () => {
        this.setState((state) => ({ displayColorPicker: !state.displayColorPicker }));
    };

    render() {
        const { label, name, value, required, size, labelPlacement, classes, disabled, ...restProps } = this.props;
        const { displayColorPicker } = this.state;

        return (
            <Fragment>
                <FormControlLabel
                    required={required}
                    label={label}
                    onClick={this.handleSwatches}
                    control={
                        <Icon
                            size={size}
                            style={{ backgroundColor: value || this.defaultValue }}
                            name={'circle'}
                            className={classes.icon}
                        />
                    }
                    labelPlacement={labelPlacement || 'end'}
                    className={classes.controlLabel}
                />
                {!disabled && displayColorPicker && (
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
                )}
            </Fragment>
        );
    }
}

export default withStyles(styles)(ColorPicker);
