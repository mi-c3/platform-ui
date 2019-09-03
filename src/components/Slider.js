import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Slider as MuiSlider } from 'material-ui-slider';

import Typography from '@material-ui/core/Typography';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';

class Slider extends PureComponent {
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

export default Slider;
