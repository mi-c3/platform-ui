# TextField

A wrapper around the MUI [TextField](https://mui.com/material-ui/api/text-field/) with different defaults (filled variant, full width, no underline) and a built-in clear button in the end adornment.

## Import

```js
import { TextField } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'filled'` \| `'outlined'` \| `'standard'` | `'filled'` | The variant to use. |
| margin | `'none'` \| `'dense'` \| `'normal'` | `'normal'` | Field margin. |
| fullWidth | bool | true | Take the full width of the container. |
| clearable | bool | true | Shows a clear (×) icon button when the field has a value and is not disabled. Clicking it fires `onChange` with `{ target: { name, type, value: null } }`. |
| error | bool | false | Standard MUI error state; additionally replaces the end adornment with an alert icon (which also clears the field on click). |
| InputProps | object | `{}` | Merged over the wrapper defaults (`endAdornment` from the clearable logic, `disableUnderline: true`). Provide your own `endAdornment` here to replace the clear button. |
| autocompleteMultiple | bool | false | Internal layout flag: suppresses the extra label margin normally applied when a `startAdornment` is present. |
| hideInput | bool | false | Visually hides the input text while the field is disabled. |

All remaining props (`label`, `name`, `value`, `onChange`, `type`, `disabled`, etc.) are passed through to the underlying MUI `TextField`.

## Usage

```jsx
<TextField
    label="First name"
    name="firstName"
    value={firstName}
    onChange={(event) => setFirstName(event.target.value)}
/>
```

## Notes

- `undefined`/`null` values are normalized to `''` so the input always stays controlled.
- The underline is disabled by default (`InputProps.disableUnderline: true`).
