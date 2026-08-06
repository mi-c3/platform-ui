# TimePicker

A time field wrapping the [TimePicker from @mui/x-date-pickers](https://mui.com/x/api/date-pickers/time-picker/). It keeps the legacy `@material-ui/pickers` v3 wrapper API: flat text-field props (`inputVariant`, `margin`, `clearable`, …) are translated internally into v8 `slots`/`slotProps`, and the change event is normalized to `{ target: { name, value, type } }`.

## Import

```js
import { TimePicker } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| value | string \| Date \| moment | — | Current time. Any value accepted by `moment()`; coerced to a moment object (or `null`) before being passed to the picker. |
| name | string | — | Field name, echoed in the change event. |
| onChange | func | — | Called with `{ target: { name, value, type } }` where `value` is a moment object (or `null` when cleared). |
| label | string | — | Label of the text field. |
| inputVariant | `'filled'` \| `'outlined'` \| `'standard'` | `'filled'` | Variant of the rendered text field (legacy name for the text field `variant`). |
| margin | `'none'` \| `'dense'` \| `'normal'` | `'normal'` | Margin of the text field. |
| fullWidth | bool | true | Text field takes the full width of the container. |
| clearable | bool | false | Adds a clear button to the field (fires `onChange` with `null`). |
| showTodayButton | bool | false | Sets the picker's action bar to exactly `['today']` (`slotProps.actionBar`), replacing whatever the picker would show by default — a desktop picker has none, so this only adds "Today". Pass `slotProps.actionBar.actions` yourself to control the full list. |
| disableToolbar | bool | false | Hides the picker toolbar. |
| TextFieldComponent | elementType | — | Custom component for the text field slot. Passing one also sets `enableAccessibleFieldDOMStructure={false}` (legacy single-`<input />` contract); pass that prop explicitly to override. |
| slots / slotProps | object | — | Passed through to the picker, merged per slot over what the legacy props produced (so `clearable` and a `slotProps.field` of your own both survive). A slot given as a function (MUI resolves it against `ownerState`) stays a function, and merges the same way once resolved. A `slots.textField` also sets `enableAccessibleFieldDOMStructure={false}`, exactly as `TextFieldComponent` does. |

All remaining props are passed through to the underlying `@mui/x-date-pickers` `TimePicker`; text-field-related props (`placeholder`, `helperText`, `error`, `required`, `InputProps`, `InputLabelProps`, `className`, `style`, `onBlur`, `onFocus`, …) are routed to `slotProps.textField`.

## Usage

```jsx
<TimePicker
    label="Start time"
    name="startTime"
    value={startTime}
    onChange={(event) => setStartTime(event.target.value)}
    clearable
/>
```

## Notes

- The legacy-to-v8 prop translation lives in `src/utils/pickers/pickerProps.js`. Legacy v3-only props with no v8 equivalent (`okLabel`, `cancelLabel`, `invalidDateMessage`, `variant`, `keyboard`, `PopoverProps`, `DialogProps`, …) are accepted but silently dropped. (`variant` is honoured only by [DateTimePicker](./DateTimePicker.md), which maps `'dialog'` to the mobile picker.)
- The text field underline is disabled by default (`InputProps.disableUnderline: true`) unless you set `disableUnderline` yourself.
- `onChange` receives a moment object, not a string — format it (e.g. `value.format('HH:mm')`) before persisting.
- The moment instance handed to the picker is reused while the instant is unchanged. MUI X compares the value by reference to decide that it changed externally, and rebuilds the field's sections and drops the clock's shallow selection when it did, so a fresh `moment(value)` per render would discard an edit in progress on any parent re-render.
