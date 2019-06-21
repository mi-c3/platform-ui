import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Switch from 'components/Switch';
import LocationForm from 'components/Location/LocationForm';
import { createEvent } from 'utils/http/event';

/**
 * Renders a location form to allow a user to change address and location.
 */
class LocationSwitch extends PureComponent {
    static propTypes = {
        ...(LocationForm || {}).propTypes, //FIXME: change using MUI convention
        name: PropTypes.string,
        label: PropTypes.string,
        onChange: PropTypes.func,
    };

    state = { checked: false };

    componentDidUpdate(prevProps, prevState) {
        const { onChange, name } = this.props;
        const { checked } = this.state;
        if (prevState.checked !== checked && !checked && onChange) {
            onChange(createEvent('change', { target: { name, value: null } }));
        }
    }

    toggleSwitch = () => this.setState({ checked: !this.state.checked });

    render() {
        const { label, SwitchProps, ...restProps } = this.props;
        const { checked } = this.state;
        return (
            <Grid>
                <Switch label={label} checked={checked} onChange={this.toggleSwitch} {...SwitchProps} />
                {checked && <LocationForm {...restProps} />}
            </Grid>
        );
    }
}

export default LocationSwitch;
