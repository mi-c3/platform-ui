import React, { PureComponent } from 'react';
import MuiSlider from '@material-ui/core/Slider';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';

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
        return <MuiSlider {...this.props} onChange={this.onChange} />;
    }
}

export default Slider;
