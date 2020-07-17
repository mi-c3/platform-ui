import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Location from 'components/Location/Location';
import Button from 'components/Button';
import { createEvent } from 'utils/http/event';
import { get } from 'utils/lo/lo';
import statefullInput from 'utils/hoc/statefullInput';
import Geocode from 'utils/maps/geocodeUtils';
import GPA from 'components/Location/GooglePlaceAutocomplete';
import { bind } from 'utils/decorators/decoratorUtils';

const GooglePlaceAutocomplete = statefullInput(GPA);

const myCurrentLocationError = () =>
    console.log({ severity: 'error', detail: 'Could not get your location, please allow location tracking in your browser' }); // eslint-disable-line no-console

class LocationForm extends PureComponent {
    static propTypes = {
        value: PropTypes.object,
        disabled: PropTypes.bool,
        name: PropTypes.string,
        onChange: PropTypes.func,
        onGoogleApiLoaded: PropTypes.func,
        withAutocomplete: PropTypes.bool,
        showCoords: PropTypes.bool,
        LocationProps: PropTypes.shape((Location || {}).propTypes),
        GooglePlaceAutocompleteProps: PropTypes.object,
        MarkerProps: PropTypes.object,
        googleApiKey: PropTypes.string.isRequired,
    };

    static defaultProps = {
        showCoords: false,
        MarkerProps: {},
    };

    geocoder = null;
    service = null;
    timer = null;
    map = null;
    maps = null;

    state = {
        mapKey: 0,
    };

    componentDidMount() {
        if (!this.props.value) {
            this.myLocation();
        }
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;
        if (prevProps.value !== value) {
            this.centerMap();
        }
    }

    @bind
    onChange(locationInfo) {
        if (this.props.onChange) {
            const name = this.props.name;
            const value = locationInfo;
            const event = createEvent('change', { target: { name, value } });
            this.props.onChange(event);
        }
    }

    @bind
    centerMap() {
        const { value } = this.props;
        if (this.maps && value) {
            const centerpoint = new this.maps.LatLng(get(value, 'latitude'), get(value, 'longitude'));
            this.map.setCenter(centerpoint);
        } else {
            this.setState((state) => ({ mapKey: state.mapKey + 1 }));
        }
    }

    @bind
    myLocation() {
        Geocode.getCurrentLocation(this.myCurrentLocation, myCurrentLocationError);
    }

    @bind
    myCurrentLocation(position) {
        this.onChange({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    }

    @bind
    onGoogleApiLoaded({ maps, map }) {
        if (!maps) {
            return;
        }
        this.map = map;
        this.maps = maps;
        this.geocoder = new maps.Geocoder();
        this.service = new maps.places.AutocompleteService();
        this.props.onGoogleApiLoaded && this.props.onGoogleApiLoaded({ maps, map });
    }

    @bind
    onMapClick(latitude, longitude) {
        this.myCurrentLocation({ coords: { latitude, longitude } });
    }

    render() {
        const {
            value,
            disabled,
            withAutocomplete,
            LocationProps,
            MarkerProps,
            GooglePlaceAutocompleteProps,
            showCoords,
            googleApiKey,
        } = this.props;
        const { mapKey } = this.state;
        const latitude = get(value, 'latitude');
        const longitude = get(value, 'longitude');
        return (
            <Grid direction="column" container>
                {!disabled && withAutocomplete && this.service && (
                    <GooglePlaceAutocomplete
                        onChangeCoords={this.myCurrentLocation}
                        placeholder={'Search a location...'}
                        name="searchingLocation"
                        geocoder={this.geocoder}
                        service={this.service}
                        fullWidth
                        {...GooglePlaceAutocompleteProps}
                    />
                )}
                <Location
                    key={mapKey}
                    googleApiKey={googleApiKey}
                    latitude={latitude}
                    longitude={longitude}
                    onClick={this.onMapClick}
                    onGoogleApiLoaded={this.onGoogleApiLoaded}
                    disabled={disabled}
                    MarkerProps={MarkerProps}
                    {...LocationProps}
                />
                <Grid container justify="space-between">
                    {showCoords ? (
                        <Grid item>
                            {latitude && <Typography variant="button">Latitude: {latitude}</Typography>}
                            {longitude && <Typography variant="button">Longitude: {longitude}</Typography>}
                        </Grid>
                    ) : (
                        <Grid item />
                    )}
                    <Grid item>
                        <Button onClick={this.centerMap} variant="text">
                            Center map
                        </Button>
                        <Button disabled={disabled} onClick={this.myLocation} variant="text">
                            My location
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default LocationForm;
