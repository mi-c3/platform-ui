import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { SwatchesPicker } from 'react-color';

import { ClickAwayListener, FormControlLabel, Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { materialColorPalette } from '../styles/palettes';
import { colors } from '../styles/theme';
import { createEvent } from '../utils/http/event';
import { bind } from '../utils/decorators/decoratorUtils';

const styles = () => ({
    swatches: {
        width: '243px !important',
        '& > div div:nth-child(2)': {
            background: `${colors.background} !important`,
        },
        '& > div div:nth-child(1) > div > span div:nth-child(1)': {
            fill: 'white !important',
        },
    },
    icon: {
        margin: '0 8px 0 0',
        borderRadius: '5rem',
    },
    controlLabel: {
        margin: '8px 0',
    },
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
        const { label, name, value, required, fontSize, labelPlacement, classes, disabled, ...restProps } = this.props;
        const { displayColorPicker } = this.state;
        /* eslint-disable */
        return (
          <Fragment>
              <FormControlLabel
                    required={required}
                  label={label}
                  onClick={this.handleSwatches}
                  control={
                        <Icon
                            fontSize={fontSize}
                            style={{ backgroundColor: value || this.defaultValue }}
                            name="circle"
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

export default withStyles(styles, { withTheme: true })(ColorPicker);
