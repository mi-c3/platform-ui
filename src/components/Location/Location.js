import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

import { DarkMapTheme } from 'styles/mapTheme';
import { Typography } from '@material-ui/core';
import { isDefined } from 'utils/utils';
import { bind } from 'utils/decorators/decoratorUtils';
import Marker from './Marker/Marker';

const Map = ({ defaultCenter, center, googleApiKey, zoom, children, ...restProps }) => (
    <div style={{ height: '300px', width: '100%' }}>
        <GoogleMapReact
            bootstrapURLKeys={{ key: googleApiKey, libraries: 'places' }}
            defaultCenter={defaultCenter}
            center={center}
            defaultZoom={zoom}
            yesIWantToUseGoogleMapApiInternals
            {...restProps}
        >
            {children}
        </GoogleMapReact>
    </div>
);

Map.propTypes = {
    defaultCenter: PropTypes.object,
    center: PropTypes.object,
    zoom: PropTypes.number,
    children: PropTypes.any,
    googleApiKey: PropTypes.string.isRequired,
};

Map.defaultProps = {
    defaultCenter: {
        lat: 59.95,
        lng: 30.33,
    },
    center: {
        lat: 59.95,
        lng: 30.33,
    },
    zoom: 11,
};

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

export default class Location extends PureComponent {
    static propTypes = {
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        writeMode: PropTypes.bool,
        onClick: PropTypes.func,
        onGoogleApiLoaded: PropTypes.func,
        disabled: PropTypes.bool,
        dark: PropTypes.bool,
        streetViewControl: PropTypes.bool,
        MarkerProps: PropTypes.object,
        googleApiKey: PropTypes.string.isRequired,
    };

    static defaultProps = {
        MarkerProps: {},
    };

    @bind
    mapClicked(mapProps) {
        !this.props.disabled && this.props.onClick(mapProps.lat, mapProps.lng);
    }

    render() {
        const { dark, streetViewControl, latitude, longitude, onGoogleApiLoaded, writeMode, MarkerProps, ...restProps } = this.props;
        const noLocation = !isDefined(latitude) || !isDefined(longitude);
        if (noLocation) {
            return <Typography> No location is available.</Typography>;
        }
        const marker = !writeMode ? <Marker lat={latitude} lng={longitude} {...MarkerProps} /> : null;
        return (
            <Map
                options={mapOptions({ dark, streetViewControl })}
                center={{ lat: latitude, lng: longitude }}
                onGoogleApiLoaded={onGoogleApiLoaded}
                {...restProps}
                onClick={this.mapClicked}
            >
                {marker}
            </Map>
        );
    }
}
