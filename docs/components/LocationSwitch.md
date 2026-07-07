# LocationSwitch

A `Switch` that shows/hides a `LocationForm`. Toggling the switch on reveals the location picker; toggling it off hides it and fires `onChange` with a `null` value to clear the location.

## Import

```js
import { LocationSwitch } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| label | string \| node | — | Label of the switch. |
| name | string | — | Field name, echoed in the change event as `event.target.name`. |
| onChange | func | — | Passed to the inner `LocationForm`. Also called with `{ target: { name, value: null } }` when the switch is turned off. |
| onToggle | func | — | Called with the new checked state (`bool`) whenever the switch is toggled. |
| SwitchProps | object | — | Extra props passed to the `Switch` component. |

All remaining props (including `googleApiKey`, `value`, `withAutocomplete`, `showCoords`, `LocationProps`, `MarkerProps`, etc.) are passed through to the underlying `LocationForm` — see its documentation.

## Usage

```jsx
<LocationSwitch
    label="Set a location"
    name="location"
    googleApiKey="YOUR_GOOGLE_MAPS_API_KEY"
    value={{ latitude: 59.9, longitude: 30.3 }}
    onChange={(event) => setLocation(event.target.value)}
    onToggle={(checked) => setMapVisible(checked)}
    withAutocomplete
/>
```

## Notes

- The switch state is internal and starts unchecked; the `LocationForm` is only mounted while the switch is on.
- This component was previously documented as `LocationFormSwitch`; the exported name is `LocationSwitch`.
