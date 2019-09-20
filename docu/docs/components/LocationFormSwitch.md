---
id: locationFormSwitch
title: LocationFormSwitch
---

## Notes

Same as `LocationForm` but just with `Switch` component for showing/hiding component. And with one extra event `onToggle`, invoking in a moment toggling of `Switch`.

## How to use

```javascript
import { LocationFormSwitch } from '@mic3/platform-ui';

<LocationFormSwitch
    onToggle={(showed) => { this.setState({ mapShowed: showed })}}
    value={{ latitude: 59.9, longitude: 30.3 }}
    onChange={onChange}
    withAutocomplete
/>
```

## Storybook

<[LocationFormSwitch](/redirect?/storybook/index.html?path=/story/components-location--locationformswitch)>
