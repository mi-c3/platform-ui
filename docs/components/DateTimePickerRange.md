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
| `PickersFromProps` | object | — | Extra props for the "From" `DateTimePicker`. Overridable: `variant`, `ampm`, `label`, `required`, `error`, `helperText`, `placeholder`, `viewRenderers`, `view`, `onViewChange`, `enableAccessibleFieldDOMStructure`. `slots` and `slotProps` are **merged** per slot over the built-in ones rather than replacing them, so the field rendering described under Notes survives — a `slotProps.textField` of your own is combined with it. Not overridable, being applied afterwards: `open`, `onOpen`, `onAccept`, `onClose`, `value`, `format`, `onChange`, `disabled`. |
| `PickersToProps` | object | — | Extra props for the "To" `DateTimePicker` (same overriding rules). |
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
- Picking only "From" auto-fills "To" with the end of that same day (23:59:59.999); picking only "To" auto-fills "From" with the start of that day (00:00:00) and keeps the time that was picked for "To". Start is clamped to be before end.
- Relative values are validated on Save: `amount` is required and the computed date must fall between 1970-01-01 and 4821-12-26, otherwise an inline error is shown and `onChange` is not called.
- Absolute ranges are validated on Save too: with only one of "From"/"To" filled in, an inline "This field is required." is shown on the empty one and `onChange` is not called. Picking either end always fills both, so this only comes up when `value` itself is a half range — an end either absent from the array (`[start]`) or empty in it (`[null, end]`). Clearing both ends saves as `null`.
- The clear icon on the field fires `onChange` with `value: null` immediately; the "Clear" button inside the modal only resets the pending value (Save still has to be pressed).
- The modal's "From"/"To" pickers are `DateTimePicker`s with the legacy `variant="dialog"`, plus overrides that restore the `@material-ui/pickers` v3 modal the 1.x line shipped. MUI X v8 exposes no props for most of it, so several of them are CSS or controlled-state workarounds keyed to MUI X internals (`.MuiTimeClock-root`, `.MuiClock-root`, `.MuiPickersLayout-*`, `.MuiPickersCalendarHeader-*`, `.MuiPickersArrowSwitcher-*`) — re-check this modal whenever `@mui/x-date-pickers` is upgraded, since a renamed class or a changed `VIEW_HEIGHT`/`CLOCK_WIDTH` degrades it silently:
    - **Opening.** The field is read-only; clicking anywhere inside it, or on its leading calendar icon (the picker's own open button, which is also the keyboard route in), opens the dialog.
    - **What the field shows.** Nothing until a value has actually been chosen — not the date the dialog opened on. v8 renders the field from the same value that drives the dialog, and paints the format as an editable mask (`DD, MMMM YYYY hh:mm`) whenever an empty field holds focus; both are bypassed by rendering the field from what the range has committed. A `placeholder` passed via `PickersFromProps`/`PickersToProps` does still show — the single-input field (`enableAccessibleFieldDOMStructure={false}`, as v3 rendered) is the only structure that honours one.
    - **One dialog, one edit.** Opening it on an end that is still empty starts it at the current date and time, so a date picked without visiting the clock tab carries the current time rather than midnight. Nothing selected inside the dialog reaches either input until "OK": both fields go on showing whatever the range held when the dialog opened — nothing at all, for an end that was empty. That covers the opposite end too, which picking a date auto-fills. "Cancel" restores the range exactly as it was, including the opposite end auto-filled in the meantime. "Today" selects the current date *and* time. Either way the consumer's `onChange` only fires on Save.
    - **Flow.** Picking a day moves straight on to the time view, and picking the hour on to the minutes, so "OK" is the only button needed and there are no view-switching arrows. v8 splits the views into two steps and waits for a "Next" action, so the view is driven by this component instead.
    - **Chrome.** A toolbar with no title at v3's 100px height, date/time tabs whose icons are white and dimmed while inactive, an analog clock instead of v8's digital columns, the month/year centred between the two calendar arrows (v8 left-aligns the label and groups both arrows to its right) at v3's arrow size — a 48px hit area and hover ring around a 16px glyph, against v8's 40px around a 24px one — and "Today" left of "Cancel"/"OK". Toolbar and tabs take `primary.main` on a light theme and `background.default` on a dark one, setting them off from the paper below.
    - **Proportions.** The clock face is v3's 260px against v8's hardcoded 220, imposed with a CSS transform since `CLOCK_WIDTH` is a constant. Selecting a day is unaffected, being an ordinary button click, but the clock's **touch** drag takes its coordinates from `getBoundingClientRect` and so is skewed by the scale; mouse and keyboard input read `offsetX` and are exact. Both tabs share v8's 336px view box rather than v3's 305px — the calendar fills its own 336 exactly, so reaching 305 meant scaling the whole grid, which shrank the day cells below v3's 36px and inset the header arrows away from v3's geometry. The dialog is therefore a little taller than v3's.
