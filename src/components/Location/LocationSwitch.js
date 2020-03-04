import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Switch from '../Switch';
import LocationForm from './LocationForm';
import { createEvent } from '../../utils/http/event';
import { bind } from '../../utils/decorators/decoratorUtils';

/**
 * Renders a location form to allow a user to change address and location.
 */
class LocationSwitch extends PureComponent {
    static propTypes = {
        ...(LocationForm || {}).propTypes, // FIXME: change using MUI convention
        name: PropTypes.string,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        onChange: PropTypes.func,
        onToggle: PropTypes.func,
    };

    state = { checked: false };

    componentDidUpdate(prevProps, prevState) {
        const { onChange, name } = this.props;
        const { checked } = this.state;
        if (prevState.checked !== checked && !checked && onChange) {
            onChange(createEvent('change', { target: { name, value: null } }));
        }
    }

    @bind
    toggleSwitch() {
        this.setState(
            (state) => ({ checked: !state.checked }),
            () => {
                const { onToggle } = this.props;
                if (onToggle) {
                    onToggle(this.state.checked);
                }
            }
        );
    }

    render() {
        const { label, SwitchProps, ...restProps } = this.props;
        const { checked } = this.state;
        return (
            <Grid>
                <Switch label={label} value={checked} onChange={this.toggleSwitch} {...SwitchProps} />
                {checked && <LocationForm {...restProps} />}
          </Grid>
        );
    }
}

export default LocationSwitch;
