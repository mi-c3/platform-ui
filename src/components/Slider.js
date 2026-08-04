import React, { forwardRef, PureComponent } from 'react';
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
        const { fillColor, innerRef, ...restProps } = this.props;
        return <StyledSlider ref={innerRef} {...restProps} $fillColor={fillColor} onChange={this.onChange} />;
    }
}

// MUI v5+ clones the child of Tooltip and of the Fade/Grow/Slide/Zoom transitions with a
// ref and expects a DOM node back; a class component hands over its instance and MUI throws.
export default forwardRef((props, ref) => <Slider {...props} innerRef={ref} />);
