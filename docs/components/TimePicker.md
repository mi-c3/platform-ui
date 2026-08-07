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
| showTodayButton | bool | false | Adds "Today" to the action bar, left of "Cancel"/"OK" as in v3. Pass `slotProps.actionBar.actions` to control the full list. |
| disableToolbar | bool | false | Hides the picker toolbar. |
| keyboardInput | bool | false | Opts out of the v3 modal: renders v8's editable section field in an inline popper and publishes every selection. See [Behaviour](#behaviour-the-v3-modal). |
| commitOn | `'accept'` \| `'change'` | `'accept'` | Where a selection is published: the action bar's OK, or every click. `'change'` is for a caller that owns its own accept. |
| TextFieldComponent | elementType | — | Custom component for the text field slot. Passing one also sets `enableAccessibleFieldDOMStructure={false}` (legacy single-`<input />` contract); pass that prop explicitly to override. |
| slots / slotProps | object | — | Passed through to the picker, merged per slot over what the legacy props produced (so `clearable` and a `slotProps.field` of your own both survive). A slot given as a function (MUI resolves it against `ownerState`) stays a function, and merges the same way once resolved. A `slots.textField` also sets `enableAccessibleFieldDOMStructure={false}`, exactly as `TextFieldComponent` does. |

All remaining props are passed through to the underlying `@mui/x-date-pickers` `MobileTimePicker` (`TimePicker` under `keyboardInput`); a `view`/`open` of your own takes over from the component's own tracking of them. Text-field-related props (`placeholder`, `helperText`, `error`, `required`, `InputProps`, `InputLabelProps`, `className`, `style`, `onBlur`, `onFocus`, …) are routed to `slotProps.textField`.

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

## Behaviour: the v3 modal

The picker renders what `@material-ui/pickers` v3 did, which is what the application expects:

- The field is **read-only** and has no trigger of its own — a click anywhere in it opens the picker.
  There are no editable sections, so nothing can be typed or stepped with the arrow keys.
- It opens in a **modal dialog** with a toolbar over the analog clock, on the hours view. Picking the hour moves on to the minutes by itself, and v8's prev/next view switcher is dropped, as in v3.
- A selection is a **draft**: it lights up in the dialog, but nothing reaches `onChange` until the
  action bar's **OK**. **Cancel** discards the draft and leaves the value exactly as it was.
- The action bar is `Clear` (when `clearable`) / `Today` (when `showTodayButton`) / `Cancel` / `OK`.
- **OK with nothing selected commits the value the dialog opened on** — so a field that seeds "now"
  (the form designer's does) commits "now", as v3 did. v8 would commit nothing there.
- The field keeps showing the value that was last committed — never the draft — so a picker opened on
  an empty field stays empty until OK.

What is deliberately NOT reproduced is v3's exact geometry and type scale — dialog width, toolbar and
view heights, clock diameter, font sizes and dim levels. Matching those meant CSS
against MUI's internal DOM, which breaks silently on a MUI upgrade; the picker takes v8's own metrics
instead — and so does `DateTimePickerRange`, whose modal opens these same pickers.

That commit point is what makes a consumer safe to freeze the value it passes down while the dialog is
open (the form designer's `DateTime` does, so a subscription update cannot overwrite an edit in
progress).

`keyboardInput` opts out, giving v8's own behaviour instead: an editable section field in an inline
popper, publishing every selection as it happens. Nothing in the application uses it — it exists so a
new screen can take typed input without forking the component.

`commitOn="change"` keeps the modal but publishes every selection, for a caller that runs its own
accept (`DateTimePickerRange` snapshots both ends itself).

## Notes

- The legacy-to-v8 prop translation lives in `src/utils/pickers/pickerProps.js`. Legacy v3-only props with no v8 equivalent (`okLabel`, `cancelLabel`, `invalidDateMessage`, `variant`, `keyboard`, `PopoverProps`, `DialogProps`, …) are accepted but silently dropped. (`variant` no longer changes anything: the modal that v3's `'dialog'` asked for is now the default — see [Behaviour](#behaviour-the-v3-modal). `keyboard` is superseded by `keyboardInput`.)
- The text field underline is disabled by default (`InputProps.disableUnderline: true`) unless you set `disableUnderline` yourself.
- `onChange` receives a moment object, not a string — format it (e.g. `value.format('HH:mm')`) before persisting.
- The moment instance handed to the picker is reused while the instant is unchanged. MUI X compares the value by reference to decide that it changed externally, and rebuilds the field's sections and drops the clock's shallow selection when it did, so a fresh `moment(value)` per render would discard an edit in progress on any parent re-render.
