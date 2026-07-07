# Radio

A labelled radio button that wraps the MUI [Radio](https://mui.com/material-ui/api/radio/) inside a [FormControlLabel](https://mui.com/material-ui/api/form-control-label/), with a normalized change event.

## Import

```js
import { Radio } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| label | string \| node | — | Label rendered next to the radio. |
| labelPlacement | `'end'` \| `'start'` \| `'top'` \| `'bottom'` | `'end'` | Position of the label. |
| color | string | `'primary'` | Color of the radio, forwarded to the MUI `Radio`. |
| value | bool | false | Checked state — passed as `checked` to the `FormControlLabel`. |
| name | string | — | Field name, echoed in the change event. |
| onChange | func | — | Called with `(event, originalEvent)` where `event.target` is `{ name, checked, value }` (`value` equals `checked`). |
| RadioProps | object | — | Extra props spread onto the inner MUI `Radio`. |

All remaining props are passed through to the underlying `FormControlLabel`.

## Usage

```jsx
<Radio
    label="Enable feature"
    name="feature"
    value={checked}
    onChange={(event) => setChecked(event.target.value)}
/>
```

## Notes

- Unlike a plain MUI `Radio`, `value` here is the boolean checked state, not the radio's option value. The change event mirrors the checked state in both `event.target.checked` and `event.target.value`.
