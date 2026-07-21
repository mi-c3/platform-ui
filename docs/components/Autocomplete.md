# Autocomplete

A typeahead/select field built on the platform-ui `TextField` (which wraps [MUI TextField](https://mui.com/material-ui/api/text-field/)), with a virtualized suggestion list (`react-tiny-virtual-list`) rendered in a [MUI Popper](https://mui.com/material-ui/api/popper/). Supports single and multiple (chips) selection, keyboard navigation, and custom option rendering.

## Import

```js
import { Autocomplete } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | func (required) | — | Called with `{ target: { name, value } }`. With `multiple`, `value` is an array. |
| `options` | array of object | `[]` | The suggestion list. Options equal to the current value are filtered out. |
| `value` | any | — | Selected value(s). With `valueField` set, the raw value(s) rather than the option object(s). |
| `name` | string | — | Field name, echoed back in the `onChange` event. |
| `multiple` | bool | — | Multi-select mode; selected values render as chips (with tooltip and delete icon). |
| `clearable` | bool | `true` | Show a clear icon at the end of the input when a value is selected (single mode only). |
| `disabled` | bool | — | Disable the input. |
| `valueField` | string | — | Path within the option object used as the value (e.g. `'value'` or `'id'`). |
| `valueId` | string | — | When the value is an array of objects, the identity field used to filter already-selected options. |
| `optionTemplate` | func | — | `(option) => ({ label, option, startAdornment, ChipProps })`. Controls how options, the selected value, and chips render. Defaults to using `option.label`. |
| `suggest` | func | — | Replaces the built-in local filtering. Called (debounced by `searchDelay`) with the input change event; you are expected to update `options` yourself. |
| `isLoading` | bool | — | Show a small spinner as the end adornment. |
| `InputProps` | object | `{}` | Merged into the underlying input's `InputProps` (adornments, etc.). |
| `VirtualListProps` | object | `{ itemSize: 50 }` | Props for the `react-tiny-virtual-list` suggestion list (`itemSize`, `height`, ...). |
| `PopperProps` | object | `{}` | Props for the suggestions Popper. |
| `optionsOverflow` | `'scroll'` \| `'hidden'` | `'scroll'` | Long option labels either scroll horizontally (items sized to the widest option) or truncate with an ellipsis. |
| `searchDelay` | number | `300` | Debounce delay (ms) applied to the suggest/filtering as the user types (both the built-in filtering and a custom `suggest`). |
| `className` / `classes` | string / object | — | Styling hooks for the root `TextField`. |

All remaining props (`label`, `error`, `helperText`, ...) are passed through to the underlying `TextField`.

## Usage

```jsx
<Autocomplete
    label="Country"
    name="country"
    options={[
        { label: 'Malta', value: 'mt' },
        { label: 'Spain', value: 'es' },
    ]}
    valueField="value"
    value={country}
    onChange={(e) => setCountry(e.target.value)}
/>
```

Custom option rendering:

```jsx
<Autocomplete
    label="Icon"
    name="icon"
    multiple
    options={icons}
    value={selectedIcons}
    onChange={onChange}
    optionTemplate={({ value, label }) => ({
        label,
        startAdornment: <MdiIcon name={value} size={19} />,
        ChipProps: { icon: <MdiIcon name={value} size={19} /> },
        option: (
            <ListItem component="div" dense disableGutters>
                <ListItemIcon><MdiIcon name={value} /></ListItemIcon>
                <ListItemText primary={label} />
            </ListItem>
        ),
    })}
/>
```

## Notes

- The change event is a plain object of the shape `{ target: { name, value } }`, not a DOM event.
- Keyboard support: `ArrowUp`/`ArrowDown` navigate suggestions, `Enter` selects, `Escape` closes, and `Backspace` (in multiple mode with an empty query) pre-selects and then removes the last chip.
- When `suggest` is provided the component performs no local filtering — pair it with externally managed `options` (or use `AutocompleteLazy`).
