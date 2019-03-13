import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Location from 'components/Location/Location';
import Button from 'components/Button';
import { createEvent } from 'utils/http/event';
import { get, set } from 'utils/lo/lo';
import statefullInput from 'stories/utils/hoc/statefullInput';
import Geocode from 'utils/maps/geocodeUtils';
import GPA from 'components/Location/GooglePlaceAutocomplete';

const GooglePlaceAutocomplete = statefullInput(GPA);

const myCurrentLocationError = () =>
    console.log({ severity: 'error', detail: 'Could not get your location, please allow location tracking in your browser' });  // eslint-disable-line no-console
/**
 * Renders a location form to allow a user to change address and location.
 */
class LocationForm extends PureComponent {
    static propTypes = {
        value: PropTypes.object,
        disabled: PropTypes.bool,
        name: PropTypes.string,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        addressOnlyFields: false,
        value: {}
    };

    geocoder = null;
    service = null;
    timer = null;

    state = { locationKey: 0 };

    constructor(props) {
        super(props);
        this.myLocation();
    }

    onChange = (locationInfo) => {
        if (this.props.onChange) {
            const name = this.props.name;
            const value = locationInfo;
            const event = createEvent('change', { target: { name, value } });
            this.props.onChange(event);
        }
    };

    // if we don't need addres we can remove this functional
    handleLatLongChange = (updatedLocationInfo) => {
        clearTimeout(this.timer);
        const lat = Number(get(updatedLocationInfo, 'latitude'));
        const long = Number(get(updatedLocationInfo, 'longitude'));
        this.timer = setTimeout(() => {
            Geocode.fromLatLong(lat, long).then(
                (response) => {
                    // const adrs = response.results[0].formatted_address;
                    const address = Geocode.getAddress(response.results[0].address_components);
                    updatedLocationInfo = set(updatedLocationInfo, 'address', { add_type: 'Physical', ...address });
                    this.onChange(updatedLocationInfo);
                },
                () => {
                    const address = Geocode.getAddress();
                    updatedLocationInfo = set(updatedLocationInfo, 'address', { add_type: 'Physical', ...address });
                    this.onChange(updatedLocationInfo);
                }
            );
        }, 1000);
    };

    centerMap = () => this.setState({ locationKey: this.state.locationKey + 1 });

    myLocation = () => Geocode.getCurrentLocation(this.myCurrentLocation, myCurrentLocationError);

    myCurrentLocation = (position) => {
        let updatedLocationInfo = set(this.props.value, 'latitude', position.coords.latitude);
        updatedLocationInfo = set(updatedLocationInfo, 'longitude', position.coords.longitude);
        this.onChange(updatedLocationInfo);
        this.handleLatLongChange(updatedLocationInfo);
    };

    onGoogleApiLoaded = ({ maps, map }) => {
        this.geocoder = new maps.Geocoder;
        this.service = new maps.places.AutocompleteService();
        this.props.onGoogleApiLoaded && this.props.onGoogleApiLoaded({ maps, map });
    };

    onMapClick = (latitude, longitude) => this.myCurrentLocation({ coords: { latitude, longitude }});

    render() {
        const { value, disabled, withAutocomplete, LocationProps } = this.props;
        const latitude = get(value, 'latitude');
        const longitude = get(value, 'longitude');
        return (
            <Grid direction="column" container >
                {!disabled && withAutocomplete && (
                    <GooglePlaceAutocomplete
                        onChangeCoords={this.myCurrentLocation}
                        placeholder={'Search a location...'}
                        name="searchingLocation"
                        geocoder={this.geocoder}
                        service={this.service}
                        fullWidth
                    />
                )}
                <Location
                    latitude={latitude}
                    longitude={longitude}
                    onClick={this.onMapClick}
                    key={this.state.locationKey}
                    onGoogleApiLoaded={this.onGoogleApiLoaded}
                    disabled={disabled}
                    {...LocationProps}
                />
                <Grid container justify="space-between" >
                    <Grid item >
                        {latitude && <Typography variant="button">Latitude: {latitude}</Typography>}
                        {longitude && <Typography variant="button">Longitude: {longitude}</Typography>}
                    </Grid>
                    <Grid item >
                        <Button onClick={this.centerMap} variant="text">
                            Center map
                        </Button>
                        <Button disabled={disabled} onClick={this.myLocation}  variant="text">
                            My location
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default LocationForm;
