import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Autocomplete from 'components/Autocomplete';
import { get } from 'utils/lo/lo';

// eslint-disable-next-line no-unused-vars
const { options, suggest, optiontemplate, variant, ...autocompletePropsSubSet } = Autocomplete.propTypes;

class GooglePlaceAutocomplete extends PureComponent {

    static propTypes = {
        ...autocompletePropsSubSet,
        geocoder: PropTypes.object,
        service: PropTypes.object,
    };

    state = {
        options: [],
    };

    componentDidUpdate(prevProps) {
        const { value, onChangeCoords } = this.props;
        const placeId = get(value, 'place_id');
        if(value !== prevProps.value && placeId && onChangeCoords) {
            this.getLatLgn(placeId, (results) => {
                onChangeCoords({
                    coords: {
                        latitude: results[0].geometry.location.lat(),
                        longitude: results[0].geometry.location.lng(),
                    }
                });
            });
        }
    }

    getLatLgn = (locationID, cb) => {
        this.props.geocoder.geocode({ placeId: locationID }, (results, status) => {
            cb(results, status);
        });
    }

    suggest = (event) => {
        const { value } = event.target;
        this.props.service.getPlacePredictions(
            { input: value },
            (predictions) => this.setState({ options: predictions || [] }));
    };

    render() {
        const { onChangeCoords, geocoder, service, ...restProps } = this.props; //eslint-disable-line no-unused-vars
        const { options } = this.state;
        return (
            <Autocomplete
                {...restProps}
                options={options}
                suggest={this.suggest}
                optionTemplate={({ description }) => ({ label: description })}
                variant="standard"
            />
        );
    }
}

export default GooglePlaceAutocomplete;
