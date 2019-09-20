---
id: location
title: Location
---

## Notes

Using `GoogleMapReact` from [google-map-react](https://github.com/google-map-react/google-map-react). Styled with

## Props

Name      |  Type  | Default | Description
--------- | :----: | ------- | -------------------------------------------------------
latitude  | float  | 59.95   | Latitude of location
longitude | float  | 30.33   | Longitude of location
zoom      | number | 11      | Zoom for google map
disabled  |  bool  | false   | if we have `onClick` event, this properties disabled it

Also support full `GoogleMapReact` component properties.

## How to use

```javascript
import { Location } from '@mic3/platform-ui';

<Location latitude={59.95} longitude={30.33} disabled />
```

## Storybook

<[Location](/redirect?/storybook/index.html?path=/story/components-location--location)>
