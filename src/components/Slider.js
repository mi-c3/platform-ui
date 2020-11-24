import React, { PureComponent } from 'react';
import MuiSlider from '@material-ui/core/Slider';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    root: {
        color: ({ fillColor }) => fillColor || '#4BB9D9',
    },
});

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
        const { fillColor, ...restProps } = this.props; // eslint-disable-line no-unused-vars
        return <MuiSlider {...restProps} onChange={this.onChange} />;
    }
}

export default withStyles(styles)(Slider);
