---
id: checkbox
title: Checkbox
---

## Notes

Component `Checkbox` based on Material UI `Checkbox`. All properties you can see in [official documentation](https://v3.material-ui.com/api/checkbox/)

`Checkbox` wrapped in [FormControlLabel](https://v3.material-ui.com/api/form-control-label/) by default.

Was rewrote `onChange` also in value now we have state `checked` or `unchecked`.

All properties passing to `FormControlLabel`.

## Props

Name           |                    Type                     | Default   | Description
-------------- | :-----------------------------------------: | --------- | ----------------------------------------------------------------------------------------------
label          |                   string                    | null      | label for Checkbox
labelPlacement |  **enum**: 'top', 'bottom', 'start', 'end'  | 'end'     | label placement
color          | **enum**: 'default', 'primary', 'secondary' | 'primary' | The color of the component. It supports those theme colors that make sense for this component.
CheckboxProps  |                   object                    | null      | Checkbox properties.

## How to use

```javascript
import { Checkbox } from '@mic3/platform-ui';

<Checkbox
  label="Status"
  name="status"
  value={false}
  onChange={(event) => {
    this.setState({ status: event.target.value })
  }}
/>
```

## Storybook

<[Checkbox](/platform-ui/redirect?/storybook/index.html?path=/story/components-selection-controls--checkbox)>
