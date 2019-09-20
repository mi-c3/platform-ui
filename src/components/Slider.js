import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import { getFillColor } from 'utils/styles/stylesUtils';

import { MDCSlider } from '@material/slider/dist/mdc.slider';
import 'styles/materialComponentsWeb.min.css';

const styles = {
    wrapper: {
        width: '100%',
        '&:not(.mdc-slider--disabled) .mdc-slider__thumb': {
            fill: getFillColor(),
            stroke: getFillColor(),
        },
        '&.mdc-slider--disabled .mdc-slider__thumb': {
            stroke: getFillColor(),
        },
        '&:not(.mdc-slider--disabled) .mdc-slider__pin': {
            backgroundColor: getFillColor(),
        },
        '&:not(.mdc-slider--disabled) .mdc-slider__track-container': {
            backgroundColor: getFillColor(26),
        },
        '&:not(.mdc-slider--disabled) .mdc-slider__track': {
            backgroundColor: getFillColor(),
        },
    },
};

class Slider extends PureComponent {
    static propTypes = {
        TypographyProps: PropTypes.object,
        label: PropTypes.string,
        classes: PropTypes.object,
        className: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.number.isRequired,
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        fillColor: PropTypes.string,
        // Per MDC documentation providing step doesn't imply discrete, so an explicit property
        discrete: PropTypes.bool,
        showMarkers: PropTypes.bool,
        onInput: PropTypes.func,
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        min: 0,
        max: 100,
        step: 1,
        TypographyProps: {},
        discrete: false,
        showMarkers: false,
        fillColor: 'primary',
    };

    nodeRef = React.createRef();

    componentDidMount() {
        this.slider = new MDCSlider(this.nodeRef.current);
        this.init(this.props);

        this.slider.listen('MDCSlider:change', () => this.handleMDCSliderChange());
        this.slider.listen('MDCSlider:input', () => this.handleMDCSliderInput());
    }

    componentDidUpdate() {
        this.init(this.props);
    }

    componentWillUnmount() {
        this.slider.unlisten('MDCSlider:change', () => this.handleMDCSliderChange());
        this.slider.unlisten('MDCSlider:input', () => this.handleMDCSliderInput());
        this.slider.destroy();
    }

    @bind
    init(props) {
        this.slider.disabled = props.disabled;
        if (props.min) {
            this.slider.min = props.min;
        }
        if (props.max) {
            this.slider.max = props.max;
        }
        if (props.step) {
            this.slider.step = props.step;
        }
        this.slider.value = props.value;
    }

    @bind
    handleMDCSliderInput() {
        const { name, onInput } = this.props;
        if (onInput) {
            onInput(
                createEvent('change', {
                    // target: { name, value: Number(Math.round(value + 'e2') + 'e-2') },
                    target: { name, value: this.slider.value },
                })
            );
        }
    }

    @bind
    handleMDCSliderChange() {
        const { name, onChange } = this.props;
        if (onChange) {
            onChange(
                createEvent('change', {
                    target: { name, value: this.slider.value },
                })
            );
        }
    }

    render() {
        const { fillColor, classes, className, value, min, max, step, discrete, showMarkers, TypographyProps, label, ...otherProps } = this.props; // eslint-disable-line no-unused-vars, prettier/prettier
        const classNames = `
            ${classes.wrapper}
            mdc-slider
            ${showMarkers ? 'mdc-slider--display-markers' : ''}
            ${discrete ? 'mdc-slider--discrete' : ''}
            ${className || ''}
        `;
        return (
            <div ref={this.nodeRef} {...otherProps} className={classNames} onChange={this.onChange}>
                {label && <Typography {...TypographyProps}>{label}</Typography>}
                <div className="mdc-slider__track-container">
                    <div className="mdc-slider__track" />
                    {discrete && showMarkers && <div className="mdc-slider__track-marker-container" />}
                </div>
                <div className="mdc-slider__thumb-container">
                    {discrete && (
                        <div className="mdc-slider__pin">
                            <span className="mdc-slider__pin-value-marker" />
                        </div>
                    )}
                    <svg className="mdc-slider__thumb" width="21" height="21">
                        <circle cx="10.5" cy="10.5" r="7.875" />
                    </svg>
                    <div className="mdc-slider__focus-ring" />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Slider);
