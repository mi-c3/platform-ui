# LocationForm

A form control for picking a geographic location: a `Location` map (built on [google-map-react](https://github.com/google-map-react/google-map-react)) with an optional Google Places search box, "Center map" and "My location" buttons, and an optional coordinates readout.

## Import

```js
import { LocationForm } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| googleApiKey | string | — | **Required.** Google Maps API key. |
| value | object | — | Current location as `{ latitude, longitude }`. |
| name | string | — | Field name, echoed in the change event as `event.target.name`. |
| onChange | func | — | Called with a synthetic event; the new location is available at `event.target.value` (`{ latitude, longitude }`). Triggered by map clicks, the search box, and the "My location" button. |
| disabled | bool | false | Disables map clicks, the search box, and the buttons. |
| withAutocomplete | bool | false | Renders a Google Places autocomplete search box above the map (once the Maps API has loaded). |
| showCoords | bool | false | Shows the current latitude/longitude values below the map. |
| onGoogleApiLoaded | func | — | Called with `{ map, maps }` once the Google Maps API has loaded. |
| LocationProps | object | — | Extra props passed to the inner `Location` component (and through it to `GoogleMapReact`). |
| GooglePlaceAutocompleteProps | object | — | Extra props passed to the autocomplete search box. |
| MarkerProps | object | `{}` | Extra props passed to the map marker. |

## Usage

```jsx
<LocationForm
    googleApiKey="YOUR_GOOGLE_MAPS_API_KEY"
    name="location"
    value={{ latitude: 59.9, longitude: 30.3 }}
    onChange={(event) => setLocation(event.target.value)}
    withAutocomplete
    showCoords
/>
```

## Notes

- If mounted without a `value`, the component asks the browser for the user's current position (geolocation) and fires `onChange` with it. If the user denies location access, an error is logged to the console.
- Clicking the map calls `onChange` with the clicked coordinates.
- The change event has the shape `{ target: { name, value: { latitude, longitude } } }`.
