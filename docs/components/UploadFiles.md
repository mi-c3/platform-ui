# UploadFiles

A file upload field built on the platform-ui `TextField`, whose end adornment is either an upload button wired to the platform-ui `Dropzone` ([react-dropzone](https://react-dropzone.js.org/)) or, once a file is set, a clear button. Single-file by default; set `multiple` for multi-file selection. Functionally the `TextField`-styled sibling of `UploadFileField`.

## Import

```js
import { UploadFiles } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| value | any | - | The current file (or file-descriptor object); with `multiple`, an array of files. A non-empty value switches the adornment from upload to clear. |
| onChange | func | - | Called with `{ target: { name, value } }`; `value` is the selected `File` (only the first dropped file), or a `File[]` when `multiple` is set, or `null` when cleared. |
| name | string | - | Field name echoed in the `onChange` payload. |
| label | string | - | Field label. |
| multiple | bool | `false` | Accept multiple files: the `Dropzone` has no files limit and `onChange` emits the full file array. |
| fileLabel | string | - | Path into `value` (lodash-style, e.g. `'name'`) used to derive the displayed text; if it yields nothing while `value` is set, `'File uploaded'` is shown. With an array `value`, the per-file label (falling back to `file.name`) is used and the names are joined by `', '`. |
| accept | string \| object | - | Accepted file types, forwarded to `Dropzone`. |
| disabled | bool | - | Hides both the upload and clear adornments. |
| fullWidth | bool | `true` | Stretches the field to the container width. |
| margin | string | `'normal'` | Field margin. |

Remaining props are passed through to the underlying platform-ui `TextField` (which itself accepts MUI [TextField](https://mui.com/material-ui/api/text-field/) props); note that `InputProps` is used internally for the adornment and would be overridden if passed.

## Usage

```jsx
<UploadFiles
    name="document"
    label="Document"
    fileLabel="name"
    accept="application/pdf"
    value={form.document}
    onChange={({ target: { name, value } }) => setForm((f) => ({ ...f, [name]: value }))}
/>
```

## Notes

- By default this is a single-file field: even if multiple files are dropped, only the first is emitted (`value[0]`). Set `multiple` to receive the full `File[]` array instead.
- The displayed text is derived from `value` + `fileLabel` (with `file.name` as the per-file fallback in `multiple` mode), never from the raw `value`, so `value` can be any object shape.
- Clearing fires `onChange` with `value: null`.
