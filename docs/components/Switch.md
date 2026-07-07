# Switch

A labelled toggle that wraps the MUI [Switch](https://mui.com/material-ui/api/switch/) inside a `FormControl` + [FormControlLabel](https://mui.com/material-ui/api/form-control-label/) with an optional helper text, and a normalized change event.

## Import

```js
import { Switch } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| label | string \| node | — | Label rendered next to the switch. |
| labelPlacement | `'end'` \| `'start'` \| `'top'` \| `'bottom'` | `'end'` | Position of the label. |
| color | string | `'primary'` | Color of the switch, forwarded to the MUI `Switch`. |
| value | bool | false | Checked state — passed as `checked` to the `FormControlLabel`. |
| name | string | — | Field name, echoed in the change event. |
| onChange | func | — | Called with `(event, originalEvent)` where `event.target` is `{ name, checked, value }` (`value` equals `checked`). |
| helperText | node | — | Helper text rendered below the switch in a `FormHelperText`. |
| required | bool | false | Forwarded to the wrapping `FormControl`. |
| error | bool | false | Forwarded to the wrapping `FormControl` (styles label and helper text). |
| SwitchProps | object | — | Extra props spread onto the inner MUI `Switch`. |
| FormControlProps | object | — | Extra props for the wrapping `FormControl`. |
| FormHelperTextProps | object | — | Extra props for the `FormHelperText`. |

All remaining props are passed through to the underlying `FormControlLabel`.

## Usage

```jsx
<Switch
    label="Status"
    name="status"
    value={status}
    helperText="Enable or disable the account"
    onChange={(event) => setStatus(event.target.value)}
/>
```

## Notes

- Unlike a plain MUI `Switch`, `value` here is the boolean checked state. The change event mirrors it in both `event.target.checked` and `event.target.value`.
