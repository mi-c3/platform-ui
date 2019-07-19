import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

import { DarkMapTheme } from 'styles/mapTheme';
import { SimpleMarker } from 'components/Location/SimpleMarker/SimpleMarker';
import { isDefined } from 'utils/utils';
import { bind } from 'utils/decorators/decoratorUtils';

const Map = ({ center, zoom, children, ...restProps }) => (
    <div style={{ height: '300px', width: '100%' }}>
        <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyBn4zixY8-GRFxLxifzO2jyrrqCRW4qn7Q', libraries: 'places' }}
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
    };

    @bind
    mapClicked(mapProps) {
        !this.props.disabled && this.props.onClick(mapProps.lat, mapProps.lng);
    }

    render() {
        const { latitude, longitude, onGoogleApiLoaded } = this.props;
        const noLocation = !isDefined(latitude) || !isDefined(longitude);

        if (noLocation) {
            return <span> No location is available. </span>;
        }
        const marker = !this.props.writeMode ? <SimpleMarker lat={latitude} lng={longitude} /> : null;
        return (
            <Map
                options={mapOptions(this.props)}
                onClick={this.mapClicked}
                center={{ lat: latitude, lng: longitude }}
                onGoogleApiLoaded={onGoogleApiLoaded}
            >
                {marker}
            </Map>
        );
    }
}
