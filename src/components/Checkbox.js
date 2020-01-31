import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { createEvent } from 'utils/http/event';
import { bind } from 'utils/decorators/decoratorUtils';

class Checkbox extends PureComponent {
    static propTypes = {
        ...(MuiCheckbox || {}).propTypes,
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
        const { CheckboxProps, labelPlacement, color, value, ...restProps } = this.props;
        return (
            <FormControlLabel
                {...restProps}
                checked={value || false}
                onChange={this.onChange}
                control={<MuiCheckbox color={color} {...CheckboxProps} />}
                labelPlacement={labelPlacement || 'end'}
            />
        );
    }
}

export default Checkbox;
