import React, { forwardRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import MuiSwitch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';

class Switch extends PureComponent {
    static propTypes = {
        ...(MuiSwitch || {}).propTypes,
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
        const {
            SwitchProps,
            FormControlProps,
            FormHelperTextProps,
            helperText,
            labelPlacement,
            color,
            value,
            required,
            error,
            innerRef,
            ...restProps
        } = this.props;
        return (
            <FormControl ref={innerRef} required={required} error={error} {...FormControlProps}>
                <FormControlLabel
                    {...restProps}
                    checked={value || false}
                    onChange={this.onChange}
                    control={<MuiSwitch color={color} {...SwitchProps} />}
                    labelPlacement={labelPlacement || 'end'}
                />
                <FormHelperText {...FormHelperTextProps}>{helperText}</FormHelperText>
            </FormControl>
        );
    }
}

// MUI v5+ clones the child of Tooltip and of the Fade/Grow/Slide/Zoom transitions with a
// ref and expects a DOM node back; a class component hands over its instance and MUI throws.
export default forwardRef((props, ref) => <Switch {...props} innerRef={ref} />);
