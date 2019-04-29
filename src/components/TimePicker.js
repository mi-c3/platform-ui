import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimePicker as TPMui, InlineTimePicker as ITPMui } from 'material-ui-pickers';

import { createEvent } from 'utils/http/event';

class TimePicker extends PureComponent {
    static propTypes = {
        ...TPMui.propTypes,
        inline: PropTypes.bool,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        ampm: false,
        inline: false,
        children: null,
    };

    onChange = (value) => {
        const { onChange, name } = this.props;
        onChange && onChange(createEvent('change', { target: { name, value } }));
    };

    render() {
        /*
         * WARNING: We need to avoid passing the onClick function because it will break the Component.
         * TODO: open a bug in the material-ui-pickers project.
         */
        // eslint-disable-next-line no-unused-vars
        const { inline, onClick, ...timePickerProps } = this.props;
        const Component = inline ? ITPMui : TPMui;
        return <Component margin="normal" {...timePickerProps} onChange={this.onChange} />;
    }
}

export default TimePicker;
