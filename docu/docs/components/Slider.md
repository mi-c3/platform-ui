---
id: slider
title: Slider
---

## Notes

Using `Slider` from [@material/slider](https://www.npmjs.com/package/@material/slider)

## Props

Name            |        Type         | Default | Description
--------------- | :-----------------: | ------- | --------------------------------------------------------------
label           |       string        | null    | label
TypographyProps |       object        | {}      | props for label wrapper Typography
className       |       string        |         | css class name
name            |       string        |         | name field
value           |       string        |         | value of the field
min             |       number        | 0       | min value in slider bar.
max             |       number        | 100     | max value in slider bar.
priority        | **enum**: 1,2,3,4,5 |         | if priority is set, slider can be on of 5 priority colors
step            |       number        | 1       | step of changes
disabled        |        bool         | false   | make field disabled
discrete        |        bool         | false   | discrete slider
showMarkers     |        bool         | false   | slider with markers
onChange        |        func         |         | You can pull out the new value by accessing event.target.value

## How to use

```javascript
import { Slider } from '@mic3/platform-ui';

<Slider label="Progress" priority={3} value={75} onChange={onChange}  />
```

## Storybook

<[Slider](/platform-ui/redirect?/storybook/index.html?path=/story/components-slider--slider)>
