# platform-ui documentation

`@mic3/platform-ui` is the Affectli React UI component library: a set of wrappers and
extensions around [MUI v7](https://mui.com/material-ui/) plus a passthrough re-export of
the MUI core components, built as a single ES module.

## Contents

| Section | What's in it |
|---------|--------------|
| [getting-started.md](getting-started.md) | Install, develop, build, test, link into an app, publish |
| [architecture.md](architecture.md) | How the library is put together: entry point, build pipeline, externals, aliases |
| [conventions.md](conventions.md) | Code style, component patterns, documentation rules |
| [components/](components/) | One page per exported component |

For AI-assisted development, [`CLAUDE.md`](../CLAUDE.md) at the repository root carries the
machine-oriented summary of commands, structure and constraints; the pages here are the
human-oriented detail it links to.

## Component index

Custom components (platform-ui implementations):

- Inputs: [Autocomplete](components/Autocomplete.md), [AutocompleteLazy](components/AutocompleteLazy.md),
  [Checkbox](components/Checkbox.md), [ColorPicker](components/ColorPicker.md), [Radio](components/Radio.md),
  [Slider](components/Slider.md), [Switch](components/Switch.md), [TextField](components/TextField.md),
  [TextEditor](components/TextEditor.md), [MdiIconSelect](components/MdiIconSelect.md)
- Date & time: [DatePicker](components/DatePicker.md), [TimePicker](components/TimePicker.md),
  [DateTimePicker](components/DateTimePicker.md), [DateTimePickerRange](components/DateTimePickerRange.md),
  [DateTimePickerRangeModal](components/DateTimePickerRangeModal.md)
- Files & upload: [Dropzone](components/Dropzone.md), [DropzoneDialog](components/DropzoneDialog.md),
  [UploadFileField](components/UploadFileField.md), [UploadFiles](components/UploadFiles.md)
- Display & feedback: [Avatar](components/Avatar.md), [AvatarEditor](components/AvatarEditor.md),
  [Button](components/Button.md), [CircularProgress](components/CircularProgress.md),
  [CircularProgressStatic](components/CircularProgressStatic.md), [ConfirmationModal](components/ConfirmationModal.md),
  [Link](components/Link.md), [MdiIcon](components/MdiIcon.md)
- Data & maps: [DataTable](components/DataTable.md), [Location](components/Location.md),
  [LocationForm](components/LocationForm.md), [LocationSwitch](components/LocationSwitch.md)

Everything else exported from the package (`Dialog`, `Grid`, `Paper`, `Typography`, …) is a
direct re-export of `@mui/material` v7 — see the [MUI documentation](https://mui.com/material-ui/)
and the compat-alias notes in [architecture.md](architecture.md).

## Adding a component page

Create `components/<ExportedName>.md` following the template in
[conventions.md](conventions.md#component-documentation), and add the component to the index
above. Docs are plain GitHub-flavored markdown browsed in the repository — there is no site
generator to build.
