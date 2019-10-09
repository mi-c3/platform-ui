---
id: locationForm
title: LocationForm
---

## Props

Name                         |  Type  | Default | Description
---------------------------- | :----: | ------- | --------------------------------------------------------------
value                        | object |         | value
withAutocomplete             |  bool  | false   | With google api autocomplete
showCoords                   |  bool  | false   | show/hide coordination values of centered marker
onChange                     |  func  |         | You can pull out the new value by accessing event.target.value
LocationProps                | object | {}      | Location properties or `GoogleMapReact` properties
GooglePlaceAutocompleteProps | object | {}      | Autocomplete properties
MarkerProps                  | object | {}      | Marker properties

## How to use

```javascript
import { LocationForm } from '@mic3/platform-ui';

<LocationForm value={{ latitude: 59.9, longitude: 30.3 }} onChange={onChange} withAutocomplete />
```

## Storybook

<[LocationForm](/platform-ui/redirect?/storybook/index.html?path=/story/components-location--locationform)>
