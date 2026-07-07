import React, { PureComponent } from 'react';
import MuiSlider from '@mui/material/Slider';
import styled from 'styled-components';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';

const StyledSlider = styled(MuiSlider)`
    color: ${({ $fillColor }) => $fillColor || '#4BB9D9'};
`;

class Slider extends PureComponent {
    static propTypes = {
        ...(MuiSlider || {}).propTypes,
    };

    @bind
    onChange(event, value) {
        const { name, onChange } = this.props;
        onChange &&
            onChange(
                createEvent('change', {
                    target: { name, value },
                    originalEvent: event,
                }),
                event
            );
    }

    render() {
        const { fillColor, ...restProps } = this.props;
        return <StyledSlider {...restProps} $fillColor={fillColor} onChange={this.onChange} />;
    }
}

export default Slider;
