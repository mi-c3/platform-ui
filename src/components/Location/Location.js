import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import { Typography } from '@material-ui/core';

import { DarkMapTheme } from '../../styles/mapTheme';
import { isDefined } from '../../utils/utils';
import { bind } from '../../utils/decorators/decoratorUtils';
import Marker from './Marker/Marker';

const Map = ({ center, zoom, children, ...restProps }) => (
    <div style={{ height: '300px', width: '100%' }}>
        <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyAGa4L1t68r0Kbsgp4UAUb9_K2mdyF2qGk', libraries: 'places' }}
            defaultCenter={center}
            defaultZoom={zoom}
            yesIWantToUseGoogleMapApiInternals
            {...restProps}
        >
            {children}
        </GoogleMapReact>
    </div>
);

Map.propTypes = {
    center: PropTypes.object,
    zoom: PropTypes.number,
    children: PropTypes.any,
};

Map.defaultProps = {
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

class Location extends PureComponent {
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

export default Location;
