# DateTimePicker

Wraps the [MUI X DateTimePicker](https://mui.com/x/api/date-pickers/date-time-picker/) (`@mui/x-date-pickers`, moment adapter) while keeping the legacy `@material-ui/pickers` v3 wrapper API: text-field props are passed flat, and `onChange` emits a normalized event with the value in `event.target.value`.

## Import

```js
import { DateTimePicker } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `value` | Date \| string \| moment | — | Current value; coerced with `moment(value)` (empty values become `null`). |
| `onChange` | func | — | Called with a `change` event where `target` is `{ name, value, type }` and `value` is a `moment` (or `null`). |
| `name` | string | — | Field name, echoed back in the change event. |
| `inputVariant` | `'standard'` \| `'outlined'` \| `'filled'` | `'filled'` | Variant of the rendered text field (mapped to `slotProps.textField.variant`). |
| `margin` | `'none'` \| `'dense'` \| `'normal'` | `'normal'` | Margin of the text field. |
| `fullWidth` | bool | `true` | Full-width text field. |
| `clearable` | bool | `false` | Adds a clear adornment to the field (mapped to `slotProps.field.clearable`; clearing fires `onChange` with `null`). |
| `showTodayButton` | bool | — | Sets the picker's action bar to exactly `['today']` (`slotProps.actionBar`), replacing whatever the picker would show by default. A desktop picker has no actions by default, so this only adds "Today"; a `variant="dialog"` picker loses its "Cancel"/"OK". Pass `slotProps.actionBar.actions` yourself to control the full list. |
| `disableToolbar` | bool | — | Hides the picker toolbar. |
| `TextFieldComponent` | elementType | — | Custom text field component (mapped to `slots.textField`). Passing one also sets `enableAccessibleFieldDOMStructure={false}`, since the legacy contract is a single `<input />` — the v8 default expects the slot to render a `PickersSectionList` and throws otherwise. Pass `enableAccessibleFieldDOMStructure` explicitly to override. |
| `minDate` / `maxDate` | Date \| string \| moment | — | Coerced to `moment` before being passed to the picker. |
| `variant` | `'dialog'` | — | Legacy v3 picker variant. `'dialog'` renders the MUI X `MobileDateTimePicker`: the picker opens in a modal with a toolbar, date/time tabs and an action bar. Any other value (or none) keeps the responsive `DateTimePicker`. |
| `slots` / `slotProps` | object | — | Passed through to the picker, merged per slot over what the legacy props produced (so `clearable` and a `slotProps.field` of your own both survive). A slot given as a function (MUI resolves it against `ownerState`) stays a function, and merges the same way once resolved. A `slots.textField` also sets `enableAccessibleFieldDOMStructure={false}`, exactly as `TextFieldComponent` does. |
| `label`, `placeholder`, `helperText`, `error`, `required`, `id`, `autoFocus`, `size`, `onBlur`, `onFocus`, `InputProps`, `inputProps`, `InputLabelProps`, `className`, `style` | — | — | Forwarded to the rendered text field (`slotProps.textField`). `InputProps.disableUnderline` defaults to `true`. |

All remaining props (`format`, `ampm`, `disablePast`, `views`, `view`, `onViewChange`, `viewRenderers`, `open`, ...) are passed through to the underlying MUI X picker — `DateTimePicker`, or `MobileDateTimePicker` when `variant="dialog"`.

## Usage

```jsx
<DateTimePicker
    label="Start time"
    name="startTime"
    value={startTime}
    onChange={(event) => setStartTime(event.target.value)}
    ampm={false}
    format="DD, MMM YYYY HH:mm"
    showTodayButton
    clearable
/>
```

## Notes

- Legacy v3-only props with no MUI X equivalent (`animateYearScrolling`, `allowKeyboardControl`, `invalidDateMessage`, `okLabel`, `cancelLabel`, `todayLabel`, `clearLabel`, `orientation`, `keyboard`, `PopoverProps`, `DialogProps`, ...) are accepted but silently dropped. `variant` is the exception — see the prop table.
- The prop-splitting logic lives in `src/utils/pickers/pickerProps.js` (`splitLegacyPickerProps`).
- [DateTimePickerRange](./DateTimePickerRange.md) builds its modal "From"/"To" fields on `variant="dialog"`, and layers further overrides on top to reproduce the v3 modal — see its Notes if you want the same look elsewhere.
