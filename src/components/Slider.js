import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Slider as MuiSlider } from 'material-ui-slider';

import Typography from '@material-ui/core/Typography';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';

import { MDCSlider } from '@material/slider/dist/mdc.slider';
import 'styles/materialComponentsWeb.min.css';

class SliderDepre extends PureComponent {
    static propTypes = {
        ...(MuiSlider || {}).propTypes,
        className: PropTypes.string,
        label: PropTypes.string,
        fillColor: PropTypes.string,
        SliderProps: PropTypes.object,
        classes: PropTypes.object,
    };

    @bind
    onChange(value, event) {
        if (event.persist) {
            event.persist();
        }
        const { name, onChange } = this.props;
        onChange &&
            onChange(
                createEvent('change', {
                    target: { name, value: Number(Math.round(value + 'e2') + 'e-2') },
                    originalEvent: event,
                }),
                event
            );
    }

    render() {
        const { label, TypographyProps, fillColor, ...restProps } = this.props;
        return (
            <Fragment>
                {label && <Typography {...TypographyProps}>{label}</Typography>}
                <MuiSlider color={fillColor} {...restProps} onChange={this.onChange} />
            </Fragment>
        );
    }
}

class Slider extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.number.isRequired,
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        // Per MDC documentation providing step doesn't imply discrete, so an explicit property
        discrete: PropTypes.bool,
        showMarkers: PropTypes.bool,
        onInput: PropTypes.func,
        onChange: PropTypes.func.isRequired,
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

    componentDidUnmount() {
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
        if (this.props.onInput) {
            this.props.onInput(this.slider.value);
        }
    }

    @bind
    handleMDCSliderChange() {
        const { name, onChange } = this.props;
        if (onChange) {
            onChange(
                createEvent('change', {
                    // target: { name, value: Number(Math.round(value + 'e2') + 'e-2') },
                    target: { name, value: this.slider.value },
                }),
                event
            );
        }
    }

    render() {
        const { className, value, min, max, step, discrete, showMarkers, ...otherProps } = this.props; // eslint-disable-line no-unused-vars
        const classNames = `
            mdc-slider
            ${showMarkers ? 'mdc-slider--display-markers' : ''}
            ${discrete ? 'mdc-slider--discrete' : ''}
            ${className || ''}
        `;
        return (
            <div ref={this.nodeRef} {...otherProps} className={classNames} onChange={this.onChange}>
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

export default Slider;
