# MdiIconSelect

An icon picker built on the platform-ui `Autocomplete` component. It is pre-populated with the bundled Material Design Icons list, renders each option with its icon preview, and filters options as you type.

## Import

```js
import { MdiIconSelect } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| onChange | func | — | **Required.** Called with `{ target: { name, value } }`. Option objects have the shape `{ value, label, type }` (icon name and font type); use `valueField="value"` to get just the icon name. |
| value | any | — | Current selection. If empty and the field is not `clearable` (or `randomized` is set), the component auto-selects an option on mount and fires `onChange`. |
| randomized | bool | false | Auto-select a random icon on mount when no `value` is provided (instead of the first one). |
| clearable | bool | true | Whether the selection can be cleared. When `false` and no `value` is set, the first icon is auto-selected on mount. |
| name | string | — | Field name, echoed in the change event. |
| valueField | string | — | Path inside the option object to use as the value (e.g. `"value"` to store the icon name string). |
| multiple | bool | false | Allow selecting multiple icons. |

The `options`, `optionTemplate`, and `suggest` props are managed internally. All remaining props are passed through to the underlying `Autocomplete` (e.g. `label`, `placeholder`, `disabled`, `fullWidth`).

## Usage

```jsx
<MdiIconSelect
    label="Choose icon"
    name="icon"
    value={icon}
    valueField="value"
    onChange={(event) => setIcon(event.target.value)}
    fullWidth
/>
```

## Notes

- The `@mdi/font` icon stylesheet must be loaded in the consuming app for the icon previews to render — see the `MdiIcon` documentation.
- Default placeholder is `"Select an icon"`.
