import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker as DPMui, InlineDatePicker as IDPMui } from 'material-ui-pickers';

import { createEvent } from 'utils/http/event';

class DatePicker extends PureComponent {
    static propTypes = {
        ...DPMui.propTypes,
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
        const { inline, onClick, ...datePickerProps } = this.props;
        const Component = inline ? IDPMui : DPMui;
        return <Component margin="normal" {...datePickerProps} onChange={this.onChange} />;
    }
}

export default DatePicker;
