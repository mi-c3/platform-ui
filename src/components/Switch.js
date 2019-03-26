
import React, { PureComponent } from 'react';
import MuiSwitch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { createEvent } from 'utils/http/event';

class Switch extends PureComponent {

    onChange = (event) => {
        const { onChange } = this.props;
        const { checked } = event.target;
        onChange && onChange(createEvent('change', {
            target: { name, checked, value: checked },
            originalEvent: event,
        }), event);
    }

    render() {
        const { labelPlacement, color, value,  ...restProps } = this.props;
        return (
            <FormControlLabel
                {...restProps}
                checked={value || false}
                onChange={this.onChange}
                control={<MuiSwitch color={color} />}
                labelPlacement={labelPlacement || 'end'}
            />
        );
    }
}

Switch.defaultProps = {
    color: 'primary',
};

export default Switch;
