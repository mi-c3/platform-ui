import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SwatchesPicker } from 'react-color';
import styled from 'styled-components';

import { IconButton, Paper, FormControl, InputLabel, Input, InputAdornment } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Icon from '@material-ui/core/Icon';
import { materialColorPalette } from 'styles/palettes';
import { withStyles } from '@material-ui/core/styles';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import { DarkTheme } from 'styles/theme';

import MdiIcon from 'components/MdiIcon';

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
        '& .MuiFormControl-root': {
            width: '100%',
        },
    },
    label: {
        marginLeft: 38,
    },
    swatches: {
        position: 'absolute',
        zIndex: 1,
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
        marginTop: 16,
        marginBottom: 8,
    },
    borderWrapper: { position: 'relative' },
});

const SwatchesPickerStyled = styled(SwatchesPicker)`
    width: ${({ width }) => `${width}px`};
`;
const IconButtonStyled = styled(IconButton)`
    margin-top: -16px;
`;

class ColorPicker extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        onMouseDown: PropTypes.func,
        name: PropTypes.string,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        value: PropTypes.string,
        randomized: PropTypes.bool,
        required: PropTypes.bool,
        disabled: PropTypes.bool,
        clearable: PropTypes.bool,
        fontSize: PropTypes.string,
        labelPlacement: PropTypes.string,
        className: PropTypes.string,
        classes: PropTypes.object,
    };

    static defaultProps = {
        disabled: false,
        required: false,
        clearable: false,
    };

    constructor(props) {
        super(props);

        this.state = { displayColorPicker: false, wrapperWidth: '100%' };

        if (!props.value && !props.randomized) {
            this.onChange({ hex: this.defaultValue });
        }
        if (!props.value && props.randomized) {
            this.onChange({ hex: this.getRandomColor() });
        }
    }
    wrapperRef = React.createRef();
    defaultValue = '#00BCD4';
    defaultColors = [
        ['#066ab1', '#0779ca'],
        ['#FFFFFF', '#00a99d', '#066ab1', '#4FC3F7', '#81C784', '#FF8A65', '#FFC107', '#FF5722', '#c62828'],
    ];

    componentDidMount() {
        this.setState({ wrapperWidth: this.wrapperRef.current.scrollWidth });
        window.addEventListener('resize', () => {
            if (this.state.wrapperWidth !== this.wrapperRef.current.scrollWidth) {
                this.setState({ wrapperWidth: this.wrapperRef.current.scrollWidth });
            }
        });
    }

    @bind
    getRandomColor() {
        const randomGroup = Math.floor(Math.random() * materialColorPalette?.length || 0);
        const randomColor = Math.floor(Math.random() * materialColorPalette[randomGroup]?.length || 0);
        return materialColorPalette[randomGroup][randomColor];
    }

    @bind
    onChange(value) {
        const { onChange, name, randomized } = this.props;
        if (onChange) {
            let nextValue = value?.hex;
            if (!nextValue && randomized) {
                nextValue = this.getRandomColor();
            }
            onChange(createEvent('change', { target: { name, value: nextValue } }));
        }
    }

    @bind
    handleSwatches() {
        this.setState((state) => ({ displayColorPicker: !state.displayColorPicker }));
    }

    @bind
    buildEndAdornment(value, clearable, disabled) {
        if (value && clearable && !disabled) {
            return (
                <IconButtonStyled aria-label="Clear input" onClick={() => this.onChange(null)}>
                    <MdiIcon name="close" />
                </IconButtonStyled>
            );
        }
    }

    render() {
        const { label, name, value, required, clearable, fontSize, classes, disabled, className, onMouseDown, ...restProps } = this.props;
        const { displayColorPicker, wrapperWidth } = this.state;
        return (
            <div className={`${className || ''} ${classes.wrapper} ColorPicker-wrapper`} ref={this.wrapperRef}>
                <Paper component="form" className={classes.root}>
                    <FormControl required={required} onClick={this.handleSwatches} disabled={disabled}>
                        <InputLabel className={classes.label}>{label}</InputLabel>
                        <Input
                            id="input-with-icon-adornment"
                            startAdornment={
                                <InputAdornment position="start">
                                    <Icon fontSize={fontSize} style={{ backgroundColor: value }} name={'circle'} className={classes.icon} />
                                </InputAdornment>
                            }
                            endAdornment={this.buildEndAdornment(value, clearable, disabled)}
                            value={value || ''}
                            disableUnderline
                            onMouseDown={onMouseDown}
                        />
                    </FormControl>
                </Paper>
                {!disabled && displayColorPicker && (
                    <div className={classes.borderWrapper} style={{ width: wrapperWidth }}>
                        <ClickAwayListener onClickAway={this.handleSwatches}>
                            <SwatchesPickerStyled
                                {...restProps}
                                width={wrapperWidth}
                                name={name}
                                color={value}
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
