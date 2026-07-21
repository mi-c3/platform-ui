import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SwatchesPicker } from 'react-color';
import styled from 'styled-components';

import { IconButton, Paper, FormControl, InputLabel, Input, InputAdornment } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Icon from '@mui/material/Icon';
import { materialColorPalette } from 'styles/palettes';
import { bind } from 'utils/decorators/decoratorUtils';
import { DarkTheme } from 'styles/theme';

import MdiIcon from 'components/MdiIcon';

const Wrapper = styled.div`
    margin-top: 16px;
    margin-bottom: 8px;
`;

const StyledPaper = styled(Paper)`
    padding: 4px;
    min-height: 56px;
    background: ${DarkTheme.palette.background.fields} !important;
    .MuiInputAdornment-positionStart {
        position: relative;
        top: -10px;
        left: 8px;
        cursor: pointer;
    }
    .MuiFormControl-root {
        width: 100%;
    }
`;

const StyledInputLabel = styled(InputLabel)`
    margin-left: 38px;
`;

const StyledIcon = styled(Icon)`
    margin: 0 8px 0 0;
    border-radius: 5rem;
`;

const BorderWrapper = styled.div`
    position: relative;
`;

const SwatchesPickerStyled = styled(SwatchesPicker)`
    width: ${({ width }) => `${width}px`};
    position: absolute;
    z-index: 1;
    & > div div:nth-child(2) {
        background: ${DarkTheme.palette.background.default} !important;
    }
    & > div div:nth-child(1) > div > span div:nth-child(1) {
        fill: white !important;
    }
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

        if (!props.clearable && !props.value && !props.randomized) {
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
            const wrapperElement = this.wrapperRef?.current;
            if (!wrapperElement) return;
            if (this.state.wrapperWidth !== wrapperElement.scrollWidth) {
                this.setState({ wrapperWidth: wrapperElement.scrollWidth });
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
            onChange({ target: { name, value: nextValue } });
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
        // eslint-disable-next-line no-unused-vars
        const { label, name, value, required, clearable, fontSize, classes, disabled, className, onMouseDown, ...restProps } = this.props;
        const { displayColorPicker, wrapperWidth } = this.state;
        return (
            <Wrapper className={`${className || ''} ColorPicker-wrapper`} ref={this.wrapperRef}>
                <StyledPaper component="form">
                    <FormControl required={required} onClick={this.handleSwatches} disabled={disabled}>
                        <StyledInputLabel>{label}</StyledInputLabel>
                        <Input
                            id="input-with-icon-adornment"
                            startAdornment={
                                <InputAdornment position="start">
                                    <StyledIcon fontSize={fontSize} style={{ backgroundColor: value }} name={'circle'} />
                                </InputAdornment>
                            }
                            endAdornment={this.buildEndAdornment(value, clearable, disabled)}
                            value={value || ''}
                            disableUnderline
                            onMouseDown={onMouseDown}
                        />
                    </FormControl>
                </StyledPaper>
                {!disabled && displayColorPicker && (
                    <BorderWrapper style={{ width: wrapperWidth }}>
                        <ClickAwayListener onClickAway={this.handleSwatches}>
                            <SwatchesPickerStyled
                                {...restProps}
                                width={wrapperWidth}
                                name={name}
                                color={value || ''}
                                colors={materialColorPalette || this.defaultColors}
                                onChange={this.onChange}
                            />
                        </ClickAwayListener>
                    </BorderWrapper>
                )}
            </Wrapper>
        );
    }
}

export default ColorPicker;
