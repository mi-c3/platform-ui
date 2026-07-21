# ColorPicker

A form field for picking a color, built on the `SwatchesPicker` from [react-color](https://casesandberg.github.io/react-color/). Clicking the input toggles a swatches panel using the platform's material color palette; the chosen hex value is emitted through a normalized change event.

## Import

```js
import { ColorPicker } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | — | The current color (hex string), shown in the input with a color dot adornment. |
| `onChange` | func | — | Called with `{ target: { name, value } }` where `value` is the selected hex color (or `null` when cleared, unless `randomized`). |
| `name` | string | — | Field name, echoed back in the change event. |
| `label` | string \| node | — | Field label. |
| `randomized` | bool | — | If no `value` is set, immediately emits a random color from the material palette (also used again after clearing). |
| `clearable` | bool | `false` | Show a clear icon when a value is set. When `false` and there is no `value` (and not `randomized`), the default `'#00BCD4'` is emitted on mount. |
| `required` | bool | `false` | Mark the form control as required. |
| `disabled` | bool | `false` | Disable the field and prevent the swatches panel from opening. |
| `fontSize` | string | — | `fontSize` of the color dot icon (`'inherit'`, `'small'`, `'large'`, ...). |
| `onMouseDown` | func | — | Forwarded to the input. |
| `className` | string | — | CSS class for the wrapper (a `ColorPicker-wrapper` class is always added). |

All remaining props are passed through to the underlying `SwatchesPicker`.

## Usage

```jsx
<ColorPicker
    label="Color"
    name="color"
    value={color}
    onChange={(event) => setColor(event.target.value)}
/>

<ColorPicker label="Tag color" name="tagColor" randomized clearable onChange={onChange} />
```

## Notes

- The component can call `onChange` during construction (default or random color) when mounted without a `value` — treat it as controlled and store the emitted value.
- The swatches panel width tracks the wrapper width and updates on window resize.
