import React, { forwardRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import MuiRadio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';

class Radio extends PureComponent {
    static propTypes = {
        ...(MuiRadio || {}).propTypes,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        labelPlacement: PropTypes.string,
    };

    static defaultProps = {
        color: 'primary',
    };

    @bind
    onChange(event) {
        const { name, onChange } = this.props;
        const { checked } = event.target;
        onChange &&
            onChange(
                createEvent('change', {
                    target: { name, checked, value: checked },
                    originalEvent: event,
                }),
                event
            );
    }

    render() {
        const { RadioProps, labelPlacement, color, value, innerRef, ...restProps } = this.props;
        return (
            <FormControlLabel
                ref={innerRef}
                {...restProps}
                checked={value || false}
                onChange={this.onChange}
                control={<MuiRadio color={color} {...RadioProps} />}
                labelPlacement={labelPlacement || 'end'}
            />
        );
    }
}

// MUI v5+ clones the child of Tooltip and of the Fade/Grow/Slide/Zoom transitions with a
// ref and expects a DOM node back; a class component hands over its instance and MUI throws.
export default forwardRef((props, ref) => <Radio {...props} innerRef={ref} />);
