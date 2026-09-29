# Autocomplete

The modernized platform typeahead: a thin adapter over [MUI v7 Autocomplete](https://mui.com/material-ui/react-autocomplete/) rendered into the platform-ui `TextField`. MUI owns the popup lifecycle, selection, filtering, keyboard navigation, accessibility and touch handling; the adapter owns the platform value contract and option templating. The listbox is always virtualized (TanStack Virtual, internal — no consumer API): only visible rows are in the DOM, rows are measured so mixed heights need no configuration, and keyboard highlights outside the rendered window are scrolled into range.

Since 2.2.0 this IS the `Autocomplete` export (the earlier hand-rolled Popper/ClickAwayListener
implementation — which lost mobile taps to a touchend/click race and unmounted its popup when
the options array changed — was removed). `AutocompleteNext` remains as a deprecated alias and
will be removed in the next major.

## Import

```js
import { Autocomplete } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | func (required) | — | Called with `{ target: { name, value } }`. With `multiple`, `value` is an array. |
| `options` | array of object | `[]` | The option list. With `suggest` the parent owns it (server-filtered); without, it is filtered locally over the template labels. |
| `value` | any | — | Selected value(s). With `valueField` set, the raw field value(s) rather than the option object(s). A value with no matching option keeps its last-selected label (internal cache), so async option churn cannot blank the field. |
| `name` | string | — | Field name, echoed back in the `onChange` event. |
| `multiple` | bool | — | Multi-select; values render as chips (tooltip, avatar/icon, delete). Selected options are hidden from the list. |
| `clearable` | bool | `true` | Always-visible clear (×) replacing the popup arrow when a single value is selected (legacy parity). |
| `disabled` | bool | — | Disable the input. An empty disabled single-select hides the input box (legacy parity). |
| `valueField` | string | — | Path within the option object used as the stored value (e.g. `'value'`, `'uri'`, `'name'`). A stored `''` or `null` selects the option holding it (e.g. `{ value: null, label: 'Any' }`); with no such option it is the empty state. |
| `optionTemplate` | func | — | `(option) => ({ label, option, startAdornment, ChipProps })`. Receives placeholder primitives for values with no matching option, like the legacy component. Defaults to `option.label`/`option.name`. |
| `suggest` | func | — | Async loading hook. Called with `{ target: { name, value: query } }` — immediately with `''` when the popup opens (first page), and debounced 300 ms as the user types. Update `options`/`isLoading` in response. |
| `isLoading` | bool | — | Spinner in the input + `loadingText` in the open popup. The popup stays open while options reload. |
| `error` / `helperText` / `label` / `placeholder` | — | — | Forwarded to the platform `TextField` (filled variant, shrunk label). |
| `InputProps` | object | — | Merged into the input's `InputProps` (adornments). The popup/clear indicators and the loading spinner own the end adornment. |
| `className` | string | — | Styling hook. |
| `VirtualListProps` | `{ itemSize }` | `{ itemSize: 50 }` | Fixed row height for the virtualized listbox (legacy contract; 60 for avatar-heavy rows). Rows clip overflow. |

Not supported (legacy props with zero verified consumers — passing them logs a one-time dev
warning and is otherwise ignored): `PopperProps`, `optionsOverflow`, `valueId`, `searchDelay`.

## Input text ownership

While a search session is open (the user has typed), the typed query owns the input; the
`value` prop owns it whenever the session is idle — the adapter derives the text from `value`
(never from MUI's own reset proposals, so a selection the parent does not adopt cannot strand
a label in the field). A session ends on selection, blur, or Escape/close, and the text then
re-derives from `value`. The clear (×) button and a chip's delete icon pressed mid-search keep
the session (the typed filter survives a chip delete; the × empties the query, keeps the popup
open and reloads the first page — stock MUI behavior, chosen over the legacy close-on-clear).

## Intentional differences from the legacy `Autocomplete`

1. Popup lifecycle is MUI-owned: taps on options cannot be lost to the touchend/click-away race, and replacing/emptying `options` while open shows `loadingText`/`noOptionsText` instead of unmounting the popup.
2. The selected single value stays visible (highlighted) in the list; reopening shows the full list, not an empty popper.
3. Typing over a selected value edits a clean input value (no mid-label caret corruption).
4. Backspace deletes the last chip in one step.

Preserved like the legacy component (validated against the live environment): opening an async
field keeps the popup closed while the first page loads — the user sees the field spinner, then
the options (this also prevents any stale filtered rows on reopen); a selected, clearable,
enabled single-select shows the always-visible clear (×) and no popup arrow.

## Example

```jsx
<Autocomplete
    name="assignee"
    label="Assignee"
    value={value}                       // e.g. 'user/alice' with valueField="uri"
    valueField="uri"
    options={options}
    isLoading={isLoading}
    suggest={({ target: { value } }) => loadOptions(value)}
    optionTemplate={({ name, avatar }) => ({ label: name, startAdornment: avatar })}
    onChange={({ target: { value } }) => setValue(value)}
/>
```
