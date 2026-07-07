# DateTimePickerRange

A date/time range field: a read-only `TextField` that opens a modal containing either two [DateTimePicker](./DateTimePicker.md)s (absolute "From"/"To") or a relative-range form ("Last/Next N minutes/hours/days/months/years"), depending on the `variant`.

## Import

```js
import { DateTimePickerRange } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `value` | array \| object | — | Either `[start, end]` (Date or date string) for an absolute range, or `{ relative: true, range: 'subtract' \| 'add', amount, unit }` for a relative range (`unit`: `'m'`, `'h'`, `'d'`, `'M'`, `'Y'`). |
| `onChange` | func | — | Called on Save (and on clear) with `{ name, value, target: { name, value } }`. `value` is the array or the relative object, `null` when cleared. |
| `name` | string | — | Field name, echoed back in the change event. |
| `variant` | `'standard'` \| `'relative'` \| `'all'` | `'standard'` | `'standard'` shows only absolute pickers, `'relative'` only the relative form, `'all'` adds a "Relative time" switch to toggle between the two. |
| `relative` | bool | `false` | Initial mode preference when `variant` allows both. |
| `defaultUnit` | string | `'m'` | Unit pre-filled when a relative value is first created. |
| `PickersFromProps` | object | — | Extra props for the "From" `DateTimePicker`. |
| `PickersToProps` | object | — | Extra props for the "To" `DateTimePicker`. |
| `TextFieldProps` | object | `{}` | Extra props for the display `TextField` (its `InputProps` override the built-in adornments). |
| `disabled` | bool | — | Disables the field and prevents the modal from opening. |
| `isMobile` | bool | — | Wraps the modal inputs instead of laying them out on one row. |
| `label` | string | — | Field label; also used as the modal title. |
| `onOpen` / `onClose` | func | — | Called when the modal opens / closes. |

All remaining props are passed through to the display `TextField`.

## Usage

```jsx
<DateTimePickerRange
    label="Created between"
    name="created"
    variant="all"
    value={range}
    onChange={(event) => setRange(event.target.value)}
/>
```

## Notes

- The displayed text is formatted as `DD, MMM YYYY HH:mm - DD, MMM YYYY HH:mm` for absolute ranges, or e.g. `Last 5 day(s)` for relative ones.
- Selecting only a start date auto-fills the end date to the end of that day (23:59:59.999) and vice versa; start is clamped to be before end.
- Relative values are validated on Save: `amount` is required and the computed date must fall between 1970-01-01 and 4821-12-26, otherwise an inline error is shown and `onChange` is not called.
- The clear icon on the field fires `onChange` with `value: null` immediately; the "Clear" button inside the modal only resets the pending value (Save still has to be pressed).
