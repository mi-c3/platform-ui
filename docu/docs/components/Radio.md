---
id: radio
title: Radio
---

## Notes

Component `Radio` based on Material UI `Radio`. All properties you can see in [official documentation](https://v3.material-ui.com/api/radio/)

`Radio` wrapped in [FormControlLabel](https://v3.material-ui.com/api/form-control-label/) by default.

All properties passing to `FormControlLabel`.

## Props

Name           |                    Type                     | Default   | Description
-------------- | :-----------------------------------------: | --------- | ----------------------------------------------------------------------------------------------
label          |                   string                    | null      | label for Checkbox
labelPlacement |  **enum**: 'top', 'bottom', 'start', 'end'  | 'end'     | label placement
color          | **enum**: 'default', 'primary', 'secondary' | 'primary' | The color of the component. It supports those theme colors that make sense for this component.
RadioProps     |                   object                    | null      | Radio properties.

## How to use

```javascript
import { Radio, RadioGroup } from '@mic3/platform-ui';

<RadioGroup name="colors" value={props.value} onChange={onChange}>
    <Radio value="primary" label="Primary" />
    <Radio color="secondary" value="male" label="Secondary color" />
    <Radio color="default" value="other" label="Default color" />
    <Radio value="disabled" disabled label="(Disabled option)" />
</RadioGroup>
```

## Storybook

<[Radio](/platform-ui/redirect?/storybook/index.html?path=/story/components-selection-controls--radio)>
