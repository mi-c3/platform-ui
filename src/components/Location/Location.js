import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

import { DarkMapTheme } from 'styles/mapTheme';
import { SimpleMarker } from 'components/Location/SimpleMarker/SimpleMarker';
import { isDefined } from 'utils/utils';

/* Map configuration */
const mapOptions = ({ dark, streetViewControl }) => (maps) => {
    const options = {
        mapTypeId: maps.MapTypeId.HYBRID,
        mapTypeControl: true,
        zoomControlOptions: {
            position: maps.ControlPosition.TOP_RIGHT,
            style: maps.ZoomControlStyle.SMALL,
        },
        mapTypeControlOptions: {
            position: maps.ControlPosition.TOP_LEFT,
            style: maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [maps.MapTypeId.SATELLITE, maps.MapTypeId.HYBRID, maps.MapTypeId.TERRAIN],
        },
        streetViewControl: false,
    };
    if (dark) {
        options.styles = DarkMapTheme;
        options.mapTypeId = maps.MapTypeId.TERRAIN;
        options.mapTypeControl = false;
    }
    if (streetViewControl) {
        options.streetViewControl = true;
    }
    return options;
};

/**
 * A map component
 */
export default class Location extends PureComponent {
    static propTypes = {
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        centerKey: PropTypes.number,
        writeMode: PropTypes.bool,
        onClick: PropTypes.func,
        iconInfo: PropTypes.object,
        onGoogleApiLoaded: PropTypes.func,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        iconInfo: {},
    };

    static defaultProps = {
        color: '',
    }

    /**
     * onclick map will change the coordinates
     */
    mapClicked = (mapProps) => {
        !this.props.disabled && this.props.onClick(mapProps.lat, mapProps.lng);
    };

    /**
     * Lifecycle hook: Executed on component render.
     * @returns {XML}
     */
    render() {
        const { latitude, longitude, onGoogleApiLoaded } = this.props;
        const noLocation = !isDefined(latitude) || !isDefined(longitude) || latitude === '' || longitude === '';

        if (noLocation) {
            return <span> No location is available. </span>;
        }
        const marker = !this.props.writeMode ? <SimpleMarker lat={latitude} lng={longitude} /> : null;
        return (
            <div style={{ height: '300px' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyBn4zixY8-GRFxLxifzO2jyrrqCRW4qn7Q', libraries: 'places' }}
                    center={{ lat: latitude, lng: longitude }}
                    options={mapOptions(this.props)}
                    {...this.props}
                    onClick={this.mapClicked}
                    onGoogleApiLoaded={onGoogleApiLoaded}
                    yesIWantToUseGoogleMapApiInternals
                >
                    {marker}
                </GoogleMapReact>
            </div>
        );
    }
}
