# Changelog

Notable changes per released version. Use these entries as the GitLab tag release notes.

## Unreleased

### Fixed

A falsy `format` — `null` or `''` — now falls back to the picker's v3 default instead of reaching
moment, which renders a falsy format as an ISO-8601 string. `format={null}` put
"2026-08-07T19:54:00+05:00" in the field: a time on a `DatePicker`, and dashes whatever format the
caller had chosen. v3 defaulted with `||`; these wrappers used an ES6 default parameter, which only
fires for `undefined`. The form designer stores exactly that null — its "Format predefined" setting
writes one the moment "Custom" is picked — so its `date` and `dateTime` fields showed the ISO value.

`DatePicker`, `TimePicker` and `DateTimePicker` open an EMPTY field on the current date/time again,
so "OK" with nothing selected commits it. 2.1.4 restored that commit for a picker whose value was
already seeded, but a genuinely empty one opened on nothing and committed nothing — v3 fell back to
`initialFocusedDate ?? now` inside `usePickerState`, so pressing OK always produced a value. The
standalone `time` field in the form designer was the visible case: its consumer
(`containers/Designer/Form/components/TimePicker.js`) seeds nothing, where the `date`/`dateTime`
fields' `DateTime` seeds its own opening value and so already behaved.

The fallback is seeded once, into the draft, when the dialog opens — not derived in render, which
v8 would read as an externally changed value and use to reset the views mid-edit. It is moved inside
`minDate`/`maxDate` when now falls outside them (`boundedNow`), so the picker never opens a view in
which every day is disabled. The field still shows only what the consumer has committed, so an empty
field stays empty until OK, and Cancel leaves it empty.

Unaffected: `keyboardInput`, and `commitOn="change"` — a caller that stages its own value
(`DateTimePickerRange`) already opens each end on "now" and restores it on Cancel. So is a caller
driving `open` itself, since MUI raises `onOpen` only for an open it performed.

## 2.1.4

### Changed

`DatePicker`, `TimePicker` and `DateTimePicker` render the v3 modal picker again, by default. What
`@material-ui/pickers` v3 gave the application — and what 1.8.9 is still serving on staging — is a
read-only field that opens a modal on a click anywhere in it, and a dialog whose selections only
count once its action bar accepts them. v8 replaced that with an editable, section-based field in an
inline popper that publishes every click. Measured against staging: its `input` is `type=text
readonly` with zero `role=spinbutton` sections against 16 on the v8 field, clicking a day left the
field on the value it opened with and only "OK" changed it, and "Cancel" put it back.

Restored, per picker:

- A read-only single input (`enableAccessibleFieldDOMStructure={false}` with the shared
  `ModalPickerField`), with no trigger of its own — `disableOpenPicker` unless a caller supplies an
  open-picker slot, since v3 opened the picker from a click anywhere in the field.
- The modal dialog (`MobileDatePicker`/`MobileTimePicker`/`MobileDateTimePicker`), with v8's own
  toolbar and date/time tabs, and v3's analog clock through `viewRenderers` — the clock without its
  prev/next view switcher, as v3 had it.
- An action bar of `Clear` (when `clearable`) / `Today` (when `showTodayButton`) / `Cancel` / `OK`.
- A draft that only publishes on accept, in `utils/pickers/V3ModalPickerBase.js`. A controlled v8
  picker keeps no draft of its own — `usePicker` renders the views from the `value` prop — so the
  selection is held there and handed back down as that prop, and the consumer hears nothing until
  "OK". "Cancel" needs no snapshot: nothing was published.
- The v3 view flow: a day click opens the time view (v8 splits those into two steps and waits for a
  "Next" action).
- Weekday names read "Sun", "Mon", ... (`dayOfWeekFormatter`), and "OK" commits the value the dialog
  opened on even when nothing was selected — v3 did, and a field that seeds "now" depends on it. v8
  decides an accept against its own `state.lastCommittedValue` and skips `onAccept` when the value
  matches, so the action bar (`slots.actionBar`) owns the commit rather than that comparison.

v3's exact geometry and type scale are deliberately NOT reproduced: dialog width, toolbar and view
heights, week-row spacing, clock diameter, font sizes and dim levels all stay v8's. Matching them
meant CSS against MUI's internal DOM — week-row margins, arrow reordering, clock scaling — which is
the first thing a MUI upgrade breaks and the last thing to say so. `DateTimePickerRange` gives up the
same geometry it had carried since 2.1.1: keeping it there left two different-looking pickers in one
application, since its modal opens the very same `DateTimePicker`. All of them now share v8's metrics
and the one piece of v3 styling that is left — the toolbar and tabs taking their own background.

This is what makes a consumer safe to freeze the value it hands a picker while the dialog is open, as
the form designer's `DateTime` does so that a subscription update cannot overwrite an edit in
progress. Under v8's publish-on-click that freeze produced a dialog whose clicks never highlighted.

`keyboardInput` opts back into v8's editable field and inline popper for a screen that wants typed
input; `commitOn="change"` keeps the modal but publishes every selection, which is what
`DateTimePickerRange` uses since it snapshots both ends itself. `variant="dialog"` is now a no-op —
the modal it asked for is the default.

### Removed

The keyboard step guard added in 2.1.3, which bounded the arrow/page/home/end keys of the v8 section
field to the picker's `minDate`/`maxDate`. The field it guarded no longer exists by default: there are
no sections to step.

## 2.1.3

### Fixed

`DatePicker`, `TimePicker` and `DateTimePicker` let the keyboard walk the field's year out of the
range the picker enforces everywhere else: at the default `maxDate` of 2099-12-31, pressing
<kbd>↑</kbd> on the year section moved it to 2100 and published that value. `@mui/x-date-pickers`
steps a section through *that section's own* boundaries only — `getSectionsBoundaries` caps a
4-digit year at 9999 whatever `minDate`/`maxDate` say — while the calendar's year list stops at the
bound. Minutes and hours never showed it because their section boundaries (59, 23) are the real
limits.

A step key (<kbd>↑</kbd>/<kbd>↓</kbd>, <kbd>PageUp</kbd>/<kbd>PageDown</kbd>,
<kbd>Home</kbd>/<kbd>End</kbd>) that moves past the bound it is heading for —
`maxDate`/`maxTime`/`disableFuture` going up, `minDate`/`minTime`/`disablePast` going down (a
`minDateTime`/`maxDateTime` prop is validated through those, not under a name of its own) — is now
dropped instead of published, which also leaves the field showing the value it had:
`updateSectionValue` builds the stepped sections locally and only publishes them,
so a step that is never published never reaches the display. Only that direction is blocked, because
a value can arrive out of range from stored data and every step from there reports the same bound —
stepping back toward the range still works. Typing is deliberately untouched: its intermediate values
(year `0002` on the way to `2026`) still reach `onChange` and are still reported as invalid, exactly
as before. The handler rides on `slotProps.textField`, so a `TextFieldComponent`/`slots.textField`
that drops unknown props does not receive it and keyboard stepping there stays unbounded.

The step and its direction are recorded by a capture-phase `keydown` handler on the field and cleared
when the change is read. They are not cleared on a microtask or from a bubble-phase handler on the
same slot: React attaches its capture-phase and bubble-phase listeners to the root container as two
separate native listeners, and a browser runs a microtask checkpoint when each of them returns, so a
microtask reset lands *before* the step is published — while a bubble reset on `slotProps.textField`
runs *before* the field's own handler rather than after it. jsdom dispatches both phases within one
stack and shows neither problem, so that lifetime is pinned by unit tests rather than by rendering.

Also fixed in the same components: the value handed to `@mui/x-date-pickers` was re-created with
`moment(value)` on every render. v8 decides a value changed externally by comparing it **by
reference** (`useFieldState` and `useValueAndOpenStates` both test `value !== lastExternalValue`) and
rebuilds the field's sections and drops the clock's shallow selection when it differs, so any parent
re-render discarded an edit in progress. The same instant now keeps the same moment instance.

## 2.1.1

### Fixed

`DateTimePickerRange` crashed when the modal showed the absolute "From"/"To" pickers — on open
in `variant="standard"`/`"all"` with an array value, and when the "Relative time" switch was
turned off:

```
MUI X: The `sectionListRef` prop has not been initialized by `PickersSectionList`
You probably tried to pass a component to the `textField` slot that contains an `<input />`
element instead of a `PickersSectionList`.
```

The two pickers were rendered as the `inputComponent` of an outer `TextField`, with a plain
`InputBase` passed as `TextFieldComponent`. `@mui/x-date-pickers` v8 defaults
`enableAccessibleFieldDOMStructure` to `true`, so the field expects that slot to render a
`PickersSectionList` and throws when it renders an `<input />`. Both layers are fixed:

- `DateTimePickerRange` now renders the "From"/"To" `DateTimePicker`s directly in the modal,
  as `variant="dialog"` pickers, instead of nesting them inside a `TextField`'s
  `inputComponent`. That restores the v3 modal: a read-only single-input field whose leading
  calendar icon opens a dialog with the toolbar, the date/time tabs and a
  "Today"/"Cancel"/"OK" action bar. `PickersFromProps`/`PickersToProps` — including
  `placeholder` — still apply.

  Several v8 defaults are overridden there to keep the v3 look and feel: the toolbar title
  ("Select date & time") is dropped and the row keeps v3's 100px height rather than being sized to
  its content; the time is picked on the analog clock rather than v8's digital columns, and without
  the prev/next view switcher; the month/year is centred between the two calendar arrows rather than
  left-aligned with both arrows to its right, at v3's arrow size (a 48px hit area and hover ring
  around a 16px glyph, against v8's 40px around a 24px one); "Today" sits left of "Cancel"/"OK"
  instead of being pushed to the end with them; and the toolbar and tabs take their own background
  (`primary.main` light, `background.default` dark) instead of v8's transparent one, with the
  date/time tab icons white on it — dimmed while inactive — instead of MUI's `textColor="primary"`
  painting the selected one blue. A click anywhere in the field opens the picker, not just the
  calendar button.

  Picking a day moves straight on to the time view, and picking the hour on to the minutes, so
  "OK" is the only button needed — v8 splits the views into two steps and waits for a "Next" action
  (`useViews` refuses to cross a step boundary), with the steps hardcoded inside its mobile picker,
  so the view is driven from the component.

  The fields show nothing until a value has actually been chosen — not the format-derived
  placeholder ("DD, MMMM YYYY hh:mm"), not the editable mask v8 paints over an empty field that
  holds focus (`useFieldV6TextField` keys that off the active element, with no prop to opt out), and
  nothing selected inside a dialog until "OK" accepts it. v8 renders the field from the same value
  that drives the dialog, so both inputs are rendered from what the range held when that dialog
  opened instead: an empty end stays empty however much is clicked inside it, including the opposite
  end that picking a date auto-fills.

  The clock face is v3's 260px rather than v8's hardcoded 220 (`CLOCK_WIDTH` is a constant, so the
  size is imposed with a CSS transform), and the time tab is pinned to the calendar's own 336px so
  the dialog no longer shrinks when switching tabs — only the calendar honoured that height before.
  Picking a day is a button click and unaffected; **touch** drag on the clock face is skewed by the
  scale, because that code path takes its coordinates from `getBoundingClientRect` where the mouse
  path uses `offsetX`. v3's shorter 305px view box is deliberately not restored: the calendar fills
  its own 336 exactly, so reaching 305 meant scaling the whole grid, which shrank the day cells
  below v3's 36px and inset the header arrows away from v3's geometry.

  The dialog is also treated as a single edit again, as in v3. Opening it on an end of the range
  that is still empty starts it at the current date and time — the field stays empty until then —
  so a date picked without visiting the clock tab carries the current time instead of midnight.
  v8 has no draft value (the dialog renders whatever `value` it is given and publishes every
  selection through `onChange`), so the range is snapshotted when the dialog opens and restored
  unless "OK" accepted the edit; "Cancel" now discards the whole edit, including the opposite end
  auto-filled from the picked date.
- `DatePicker`, `TimePicker` and `DateTimePicker` set `enableAccessibleFieldDOMStructure={false}`
  whenever a text field of the caller's own is used — the legacy `TextFieldComponent` prop or a
  v8 `slots.textField` — since the legacy contract is a single `<input />` and a slot passed
  straight through is on the same footing. Pass `enableAccessibleFieldDOMStructure` explicitly to
  override.

Also fixed in `DateTimePickerRange`: an absolute range with only one end filled in is refused on
Save with an inline "This field is required." instead of writing `null` over the range that was
already applied, and the modal's "Clear" button and the "Relative time" switch now drop that
error instead of leaving it on both fields. That covers an end left empty in the array (`[null,
end]`, `[undefined, end]`) as well as one absent from it (`[start]`) — an empty end used to be
read as filled, because coercing the array to `Date`s turns `null` into the epoch and `undefined`
into an Invalid Date, both truthy, so "01, Jan 1970 05:00" (or "Invalid date") showed in the field
and saved. Picking only "To" keeps the time that was picked for it rather than snapping to
23:59:59.999 (only the auto-filled "From" is moved to 00:00:00).

`DateTimePickerRange` also no longer throws `end.getTime is not a function` when a range that came
in as date **strings** (which `value` accepts) is picked in after the "Relative time" switch has
been turned off. Toggling the switch put the raw prop value into state, where the two ends are
compared with `getTime()`; every path into that state now coerces to `Date`, as the initial one
already did.

### Added

- `DateTimePicker` honours the legacy v3 `variant="dialog"`, which renders the MUI X
  `MobileDateTimePicker` (modal picker with toolbar, date/time tabs and an action bar). Any
  other value keeps the responsive picker, as before.
- `DatePicker`, `TimePicker` and `DateTimePicker` accept v8 `slots`/`slotProps` and merge them
  per slot over what the legacy props produced, so `clearable` and a `slotProps.field` of your
  own no longer overwrite one another. Previously both were dropped. A slot given as a function
  (MUI resolves those against `ownerState`) is merged too, rather than replacing the derived
  props: a `slotProps.textField` callback keeps the `label`/`error`/`helperText`/`placeholder`
  the legacy props routed to the field, and still gets the default
  `InputProps.disableUnderline` — which used to be assigned onto the callback itself, so it was
  both lost and a mutation of the caller's function.
- `DateTimePickerRange` merges the `slots`/`slotProps` of `PickersFromProps`/`PickersToProps` per
  slot over the ones its modal pickers need, instead of letting either side win outright — passing
  a `slotProps.textField` of your own no longer blanks the field or costs it its click-to-open.

## 2.1.0

### Breaking (peer dependency), despite the minor bump

`react-router-dom` is replaced by `react-router`. `Link` is the only component that imports a
router directly, and it now takes its `RouterLink` from `react-router`:

```diff
-import { Link as RouterLink } from 'react-router-dom';
+import { Link as RouterLink } from 'react-router';
```

Two peer ranges narrow as a result:

| Peer | Before | After |
|------|--------|-------|
| router | `"react-router-dom": ">=5.1.2 <7"` | `"react-router": ">=7 <9"` |
| react / react-dom | `">=17.0.0 <20"` | `">=18.0.0 <20"` |

**Consumers on react-router v5 or v6 are no longer supported.** Those versions do not export
`Link` from `react-router` — the DOM components only existed in `react-router-dom` — so
`<Link to="...">` fails to resolve. `<Button to="...">` is affected too — it renders through
the same `Link`. Upgrade the application to react-router 7 or 8 before taking this release.

**Consumers on react 17 are no longer supported.** react-router 7 peers `react >=18` (8 peers
`>=19.2.7`), so a react-17 app cannot satisfy the new router peer at all. MUI 7 on its own
would still allow react 17; the router is what sets the floor. Staying on react 17 means
staying on 2.0.0.

Why the router swap at all: react-router 8 deleted the `react-router-dom` package outright, and
pinning `react-router-dom@7.18.1` (its final release) drags in exactly `react-router@7.18.1`,
which is covered by [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2)
(high, no patched 7.x exists).

### Not changed

- **`engines.node` stays `>=22.11.0 <23`.** react-router 8 declares `engines.node >=22.22.0`,
  but that binds this repo's toolchain, not consumers of the published bundle — which is
  browser ESM and runs no node code. Consumers who choose react-router 8 get that constraint
  from react-router itself; consumers on react-router 7 (`>=20.0.0`) should not inherit it.
  The dev floor lives in `.nvmrc` and the `.gitlab-ci.yml` image instead, both at 22.22.1.
- react-router stays an rspack external — the consuming app still owns the router instance.
