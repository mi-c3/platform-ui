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
| `clearable` | bool | `false` | Adds a clear (×) button to the field AND a "Clear" action to the dialog, as v3 had. Either fires `onChange` with `null`. The field's own button is rendered by the picker rather than by MUI, whose field suppresses it on a read-only input. |
| `showTodayButton` | bool | — | Adds "Today" to the action bar, left of "Cancel"/"OK" as in v3. Pass `slotProps.actionBar.actions` to control the full list. |
| `disableToolbar` | bool | — | Hides the picker toolbar. |
| `keyboardInput` | bool | `false` | Opts out of the v3 modal: renders v8's editable section field in an inline popper and publishes every selection. See [Behaviour](#behaviour-the-v3-modal). |
| `commitOn` | `'accept'` \| `'change'` | `'accept'` | Where a selection is published: the action bar's OK, or every click. `'change'` is for a caller that owns its own accept. |
| `TextFieldComponent` | elementType | — | Custom text field component (mapped to `slots.textField`). Passing one also sets `enableAccessibleFieldDOMStructure={false}`, since the legacy contract is a single `<input />` — the v8 default expects the slot to render a `PickersSectionList` and throws otherwise. Pass `enableAccessibleFieldDOMStructure` explicitly to override. |
| `minDate` / `maxDate` | Date \| string \| moment | — | Coerced to `moment` before being passed to the picker. |
| `format` | string | `'MMM Do YYYY, HH:mm'` | How the field renders the committed value — v3's date-time format. Passed through to the picker too. A falsy value (`null`, `''`) falls back to the default rather than reaching moment, which renders a falsy format as an ISO-8601 string. |
| `variant` | `'dialog'` | — | Legacy v3 picker variant, now a no-op: the modal it asked for is the default. See [Behaviour](#behaviour-the-v3-modal), and `keyboardInput` for v8's inline popper. |
| `slots` / `slotProps` | object | — | Passed through to the picker, merged per slot over what the legacy props produced (so `clearable` and a `slotProps.field` of your own both survive). A slot given as a function (MUI resolves it against `ownerState`) stays a function, and merges the same way once resolved. A `slots.textField` also sets `enableAccessibleFieldDOMStructure={false}`, exactly as `TextFieldComponent` does. |
| `label`, `placeholder`, `helperText`, `error`, `required`, `id`, `autoFocus`, `size`, `onBlur`, `onFocus`, `InputProps`, `inputProps`, `InputLabelProps`, `className`, `style` | — | — | Forwarded to the rendered text field (`slotProps.textField`). `InputProps.disableUnderline` defaults to `true`. |

All remaining props (`ampm`, `disablePast`, `views`, `view`, `onViewChange`, `viewRenderers`, `open`, ...) are passed through to the underlying MUI X picker — `MobileDateTimePicker`, or `DateTimePicker` under `keyboardInput`. A `view`/`open` of your own takes over from the component's own tracking of them.

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

## Behaviour: the v3 modal

The picker renders what `@material-ui/pickers` v3 did, which is what the application expects:

- The field is **read-only** and has no trigger of its own — a click anywhere in it opens the picker.
  There are no editable sections, so nothing can be typed or stepped with the arrow keys.
- It opens in a **modal dialog** with v8's own toolbar, date and time tabs, and an analog clock, on
  the day view. Picking a day moves on to the time view and picking the hour to the minutes, so "OK"
  is the only button needed — v8 splits those views into two steps and waits for a "Next" action.
- A selection is a **draft**: it lights up in the dialog, but nothing reaches `onChange` until the
  action bar's **OK**. **Cancel** discards the draft and leaves the value exactly as it was.
- The action bar is `Clear` (when `clearable`) / `Today` (when `showTodayButton`) / `Cancel` / `OK`,
  and a `clearable` picker also carries a clear (×) button in the field itself. Clearing from the
  field publishes straight away and does not open the dialog.
- **OK with nothing selected commits the value the dialog opened on** — and an empty field opens on
  the current date and time, so one click fills it in. v3 did both (`usePickerState` fell back to
  `initialFocusedDate ?? now`); v8 opens on nothing and commits nothing. The fallback is moved inside
  `minDate`/`maxDate` when now falls outside them, so it never opens a view the picker forbids. A
  consumer that seeds its own opening value (the form designer's `DateTime`) passes one in and
  overrides the fallback; so does a caller driving `open` itself, which MUI does not report as an open.
- The field keeps showing the value that was last committed — never the draft, and never the "now"
  an empty picker opened on — so a picker opened on an empty field stays empty until OK.
- Weekday names read "Sun", "Mon", ... (`dayOfWeekFormatter`), as v3's did.

What is deliberately NOT reproduced is v3's exact geometry and type scale — dialog width, toolbar and
view heights, week-row spacing, clock diameter, font sizes and dim levels. Matching those meant CSS
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

- Legacy v3-only props with no MUI X equivalent (`animateYearScrolling`, `allowKeyboardControl`, `invalidDateMessage`, `okLabel`, `cancelLabel`, `todayLabel`, `clearLabel`, `orientation`, `keyboard`, `PopoverProps`, `DialogProps`, `variant`, ...) are accepted but silently dropped; `keyboard` is superseded by `keyboardInput`.
- The prop-splitting logic lives in `src/utils/pickers/pickerProps.js` (`splitLegacyPickerProps`).
- [DateTimePickerRange](./DateTimePickerRange.md) builds its modal "From"/"To" fields on this component, with `commitOn="change"` because it stages both ends itself — see its Notes for what that changes.
- The moment instance handed to the picker is reused while the instant is unchanged. MUI X compares the value by reference to decide that it changed externally, and rebuilds the field's sections and drops the clock's shallow selection when it did, so a fresh `moment(value)` per render would discard an edit in progress on any parent re-render.
