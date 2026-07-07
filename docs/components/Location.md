# Location

A Google Map with an optional marker, built on [google-map-react](https://github.com/google-map-react/google-map-react). The map is rendered inside a fixed-height (300px), full-width container.

## Import

```js
import { Location } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| googleApiKey | string | — | **Required.** Google Maps API key (the map is bootstrapped with the `places` library). |
| latitude | number | — | Latitude of the marker/map center. |
| longitude | number | — | Longitude of the marker/map center. |
| zoom | number | 11 | Default zoom level of the map. |
| writeMode | bool | false | When `true`, the marker is not rendered (useful when the map is used to pick a location). |
| onClick | func | — | Called with `(lat, lng)` when the map is clicked (unless `disabled`). |
| onGoogleApiLoaded | func | — | Called with `{ map, maps }` once the Google Maps API has loaded. |
| disabled | bool | false | Suppresses the `onClick` handler. |
| dark | bool | false | Applies the dark map theme (terrain map type, map-type control hidden). |
| streetViewControl | bool | false | Shows the Street View control (hidden by default). |
| MarkerProps | object | `{}` | Extra props spread onto the internal `Marker` component. |

All remaining props are passed through to the underlying `GoogleMapReact` component.

## Usage

```jsx
<Location
    googleApiKey="YOUR_GOOGLE_MAPS_API_KEY"
    latitude={59.95}
    longitude={30.33}
    zoom={11}
/>
```

## Notes

- A valid Google Maps API key is required; without it the map tiles will not load.
- If either `latitude` or `longitude` is undefined, the component renders the text "No location is available." instead of a map.
- The map defaults to the hybrid map type with a satellite/hybrid/terrain dropdown control, unless `dark` is set.
