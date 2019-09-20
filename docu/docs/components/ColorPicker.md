---
id: colorPicker
title: ColorPicker
---

## Notes

Using `SwatchesPicker` from [react-color](https://casesandberg.github.io/react-color/)

Was rewrote `onChange` in `event.target.value` we put hex color.

## Props

Name           |                       Type                       | Default   | Description
-------------- | :----------------------------------------------: | --------- | ------------------------------------------------------------------------------------------------
fontSize       | **enum**: 'inherit', 'default', 'small', 'large' | 'default' | The fontSize applied to the icon. Defaults to `24px`, but can be configure to inherit font size.
disabled       |                       bool                       | false     | If true, the input will be disabled.
required       |                       bool                       | false     | If true, the input will be required.
value          |                 HEX or CSS color                 | '#00BCD4' | The value of the component, required for a controlled component.
labelPlacement |    **enum**: 'top', 'bottom', 'start', 'end'     | 'end'     | label placement
label          |                      string                      | null      | label for ColorPicker
onChange       |                       func                       |           | You can pull out the new value by accessing event.target.value

## How to use

```javascript
import { ColorPicker } from '@mic3/platform-ui';

<ColorPicker onChange={onChange} value="#FF8A65" label="Color" />
```

## Storybook

<[ColorPicker](/redirect?/storybook/index.html?path=/story/components-colorpicker--color-picker)>
