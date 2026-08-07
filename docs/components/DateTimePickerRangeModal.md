# DateTimePickerRangeModal

A read-only text field that opens a MUI [Dialog](https://mui.com/material-ui/api/dialog/) containing two platform-ui `DateTimePicker` fields ("From" / "To") for picking a date-time range.

## Import

```js
import { DateTimePickerRangeModal } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| value | array of (string \| Date) | - | The `[start, end]` range. Each entry may be a date string or a `Date`. Re-synced into internal state whenever the prop reference changes. |
| name | string | - | Field name, echoed in the `onChange` payload. |
| onChange | func | - | Called on Save and on Clear with `{ name, value, target: { name, value } }`, where `value` is `[startDate, endDate]` (`Date` objects) or falsy when cleared. |
| TextFieldProps | object | - | Extra props spread onto the trigger `TextField`. |
| PickersFromProps | object | - | Extra props spread onto the "From" `DateTimePicker`. |
| PickersToProps | object | - | Extra props spread onto the "To" `DateTimePicker`. |

`DateTimePicker`'s propTypes are inherited, but other props are not forwarded to the pickers — use `PickersFromProps` / `PickersToProps` for that.

## Usage

```jsx
<DateTimePickerRangeModal
    name="period"
    value={form.period}
    onChange={({ target: { name, value } }) => setForm((f) => ({ ...f, [name]: value }))}
/>
```

## Notes

- Picker changes are staged in internal state and only committed via the **Save** button; **Cancel** closes the dialog without firing `onChange`. **Clear** (dialog button or the field's close icon) resets to `[null, null]` and fires `onChange` immediately with a falsy `value`.
- Range auto-normalization: picking a start with no end sets the end to the same day at 23:59:59.999; picking an end with no start sets the start to the same day at 00:00:00.000; an inverted range is clamped so start equals end. Start gets milliseconds `0`, end `999`.
- The trigger field is `disabled` and shows either `"All days"` (empty) or the saved range formatted as `DD, MMM YYYY HH:mm - DD, MMM YYYY HH:mm` (via moment).
- Both pickers are platform-ui `DateTimePicker`s with `showTodayButton` and 24-hour time (`ampm={false}`), so each opens its own modal with a "Today"/"Cancel"/"OK" action bar and holds its selection until that OK. An accepted end then lands in this component's own state — the dialog's **Save** is still what commits the range, and **Cancel**/**Clear** work as described above.
