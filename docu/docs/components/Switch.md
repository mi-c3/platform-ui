---
id: switch
title: Switch
---

## Notes

Component `Switch` based on Material UI `Switch`. All properties you can see in [official documentation](https://v3.material-ui.com/api/switch/)

`Checkbox` wrapped in [FormControl](https://v3.material-ui.com/api/form-control-label/) by default.

Was rewrote `onChange` also in value now we have state `checked` or `unchecked`.

All properties passing to `FormControlLabel`.

## Props

Name               |                    Type                     | Default   | Description
------------------ | :-----------------------------------------: | --------- | ----------------------------------------------------------------------------------------------
label              |                   string                    | null      | label for Checkbox
labelPlacement     |  **enum**: 'top', 'bottom', 'start', 'end'  | 'end'     | label placement
color              | **enum**: 'default', 'primary', 'secondary' | 'primary' | The color of the component. It supports those theme colors that make sense for this component.
SwitchProps        |                   object                    | null      | Switch properties.
FormControlProps   |                   object                    | null      | FormControl properties.
FormHelperTextProp |                   object                    | null      | FormHelperText properties.

## How to use

```javascript
import { Switch } from '@mic3/platform-ui';

<Switch
  label="Status"
  name="status"
  value={false}
  onChange={(event) => {
    this.setState({ status: event.target.value })
  }}
/>
```

## Storybook

<[Switch](/platform-ui/redirect?/storybook/index.html?path=/story/components-selection-controls--switch)>
