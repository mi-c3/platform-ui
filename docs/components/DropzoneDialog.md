# DropzoneDialog

A file-upload dialog: a MUI [Dialog](https://mui.com/material-ui/api/dialog/) wrapping the platform-ui `Dropzone` (itself built on [react-dropzone](https://react-dropzone.js.org/)), with Cancel and Save actions.

## Import

```js
import { DropzoneDialog } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| open | bool | `false` | **Required.** Whether the dialog is shown. |
| title | string | `'Upload File'` | Dialog title; pass a falsy value to hide it. |
| onClose | func | - | Called on Cancel, backdrop close, and after a successful Save. |
| onSave | func | - | Called with the current `value` prop (the array of files) when Save is clicked; `onClose` is called right after. If omitted, Save does nothing. |
| value | array | - | The current files, managed by the consumer (the `Dropzone` is controlled). |
| onChange | func | - | Fired by the inner `Dropzone` as `{ target: { name, value } }` where `value` is the updated file array. |
| fullScreen | bool | `false` | Render the dialog full-screen (forwarded to the MUI `Dialog`). |

All remaining props (`accept`, `filesLimit`, `dropzoneText`, `multiple`, `name`, ...) are passed through to `Dropzone`, which defaults `showPreviews`, `showPreviewsInDropzone`, and `showAlerts` to `false` here — see the `Dropzone` docs.

## Usage

```jsx
const [files, setFiles] = useState([]);

<DropzoneDialog
    open={isOpen}
    title="Upload File"
    value={files}
    onChange={({ target: { value } }) => setFiles(value)}
    onSave={(value) => upload(value)}
    onClose={() => setIsOpen(false)}
/>
```

## Notes

- The `Dropzone` is fully controlled: you must hold the files in your own state via `value` / `onChange`; `onSave` simply hands you back the current `value`.
- The export is wrapped in a stub `withMobileDialog()` HOC that only supplies defaults (`fullScreen={false}`, `width="lg"`); a `fullScreen` prop you pass takes precedence and is respected.
