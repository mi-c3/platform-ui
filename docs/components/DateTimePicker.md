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
| `showTodayButton` | bool | — | Adds a "Today" action to the picker's action bar. |
| `disableToolbar` | bool | — | Hides the picker toolbar. |
| `TextFieldComponent` | elementType | — | Custom text field component (mapped to `slots.textField`). |
| `minDate` / `maxDate` | Date \| string \| moment | — | Coerced to `moment` before being passed to the picker. |
| `label`, `placeholder`, `helperText`, `error`, `required`, `id`, `autoFocus`, `size`, `onBlur`, `onFocus`, `InputProps`, `inputProps`, `InputLabelProps`, `className`, `style` | — | — | Forwarded to the rendered text field (`slotProps.textField`). `InputProps.disableUnderline` defaults to `true`. |

All remaining props (`format`, `ampm`, `disablePast`, `views`, ...) are passed through to the MUI X `DateTimePicker`.

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

- Legacy v3-only props with no MUI X equivalent (`animateYearScrolling`, `allowKeyboardControl`, `invalidDateMessage`, `okLabel`, `cancelLabel`, `todayLabel`, `clearLabel`, `variant`, `orientation`, `keyboard`, `PopoverProps`, `DialogProps`, ...) are accepted but silently dropped.
- The prop-splitting logic lives in `src/utils/pickers/pickerProps.js` (`splitLegacyPickerProps`).
