# Checkbox

Wraps [MUI Checkbox](https://mui.com/material-ui/api/checkbox/) inside a [FormControlLabel](https://mui.com/material-ui/api/form-control-label/), with a normalized `value`/`onChange` contract: the checked state is read from `value` and the change event carries the new boolean in `event.target.value`.

## Import

```js
import { Checkbox } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `value` | bool | `false` | The checked state (controlled). |
| `onChange` | func | — | Called with a `change` event where `target` is `{ name, checked, value: checked }` (the original DOM event is available as `event.originalEvent` and as a second argument). |
| `name` | string | — | Field name, echoed back in the change event. |
| `label` | string \| node | — | Label rendered by the `FormControlLabel`. |
| `labelPlacement` | `'top'` \| `'bottom'` \| `'start'` \| `'end'` | `'end'` | Label placement. |
| `color` | string | `'primary'` | Color of the inner MUI `Checkbox`. |
| `CheckboxProps` | object | — | Extra props for the inner MUI `Checkbox`. |

All remaining props are passed through to the `FormControlLabel` (e.g. `disabled`).

## Usage

```jsx
<Checkbox
    label="Active"
    name="active"
    value={active}
    onChange={(event) => setActive(event.target.value)}
/>
```
