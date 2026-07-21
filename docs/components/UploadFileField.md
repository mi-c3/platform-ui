# UploadFileField

A single-file upload form field: a labelled MUI [Input](https://mui.com/material-ui/api/input/) (inside a `FormControl`, with an "earth-box" leading icon) whose end adornment is either an upload button wired to the platform-ui `Dropzone` ([react-dropzone](https://react-dropzone.js.org/)) or, once a file is set, a clear button.

## Import

```js
import { UploadFileField } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| value | any | - | The current file (or file-descriptor object). Truthy value switches the adornment from upload to clear. |
| onChange | func | - | Called with `{ target: { name, value } }`; `value` is the selected `File` (only the first dropped file) or `null` when cleared. |
| name | string | - | Field name echoed in the `onChange` payload. |
| label | string | - | Input label. |
| fileLabel | string | - | Path into `value` (lodash-style, e.g. `'name'`) used to derive the displayed text; if it yields nothing while `value` is set, `'File uploaded'` is shown. |
| accept | string \| object | - | Accepted file types, forwarded to `Dropzone`. |
| disabled | bool | - | Hides both the upload and clear adornments. |
| error | bool | - | Marks the helper text as an error. |
| helperText | node | - | Helper text under the input. |
| fullWidth | bool | `true` | Stretches the field to the container width. |
| margin | string | `'normal'` | `'normal'` adds `1rem` vertical margin around the field. |

Remaining props are passed through to the underlying MUI `Input` (the component also declares MUI `TextField`'s propTypes).

## Usage

```jsx
<UploadFileField
    name="attachment"
    label="Attachment"
    fileLabel="name"
    accept="image/*,application/pdf"
    value={form.attachment}
    onChange={({ target: { name, value } }) => setForm((f) => ({ ...f, [name]: value }))}
/>
```

## Notes

- Single file only: even if multiple files are dropped, only the first is emitted (`value[0]`); the rest are discarded.
- The displayed input text is derived from `value` + `fileLabel`, never from the raw `value`, so `value` can be any object shape.
- Clearing fires `onChange` with `value: null`.
