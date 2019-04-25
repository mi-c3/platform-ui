import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker as DTPMui, InlineDateTimePicker as IDTPMui } from 'material-ui-pickers';

import { createEvent } from 'utils/http/event';

class DateTimePicker extends PureComponent {
    static propTypes = {
        ...DTPMui.propTypes,
        inline: PropTypes.bool,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        animateYearScrolling: true,
        inline: false,
    };

    onChange = (value) => {
        const { onChange } = this.props;
        onChange && onChange(createEvent('change', { target: { name, value } }));
    };

    render() {
        /*
         * WARNING: We need to avoid passing the onClick function because it will break the Component.
         * TODO: open a bug in the material-ui-pickers project.
         */
        // eslint-disable-next-line no-unused-vars
        const { inline, onClick, ...dateTimePickerProps } = this.props;
        const Component = inline ? IDTPMui : DTPMui;
        return <Component margin="normal" {...dateTimePickerProps} onChange={this.onChange} />;
    }
}

export default DateTimePicker;
