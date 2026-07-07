# Dropzone

Wraps [react-dropzone](https://github.com/react-dropzone/react-dropzone) (v14) while keeping the older v9-style API: `accept` may be a comma-separated string and rejection callbacks receive plain `File` objects. Renders either a default upload area (cloud icon + text) or your own `children` as the drop target, plus a file list with preview avatars, download links, and delete-with-confirmation.

## Import

```js
import { Dropzone } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `value` | array of File | — | The current files (controlled). Rendered in the list below the drop area. |
| `onChange` | func | — | Called with `{ target: { name, value } }` where `value` is the updated files array (after an accepted drop or a delete). |
| `name` | string | — | Field name, echoed back in the change event. |
| `accept` | string \| object | `'image/*,video/*,application/*,audio/*,text/*'` | Accepted types. A comma-separated MIME string is converted to the react-dropzone v14 object format; an object is passed through as-is. |
| `filesLimit` | number | `1` | Maximum number of files kept after a drop (excess files are discarded). |
| `multiple` | bool | — | Allow selecting multiple files in the native file dialog. |
| `capture` | bool | `true` | `capture` attribute on the underlying `<input>`. |
| `dropzoneText` | string | — | Text shown in the default drop area. |
| `dropzoneTextHover` | string | — | Text shown while dragging files over the drop area. |
| `children` | node \| func | — | Custom drop-target content; replaces the default upload area (a drag overlay with `dropzoneTextHover` is shown while dragging). |
| `showPreviews` | bool | `false` | When true together with `filesTemplate`, renders `filesTemplate(value)` instead of the built-in file list. |
| `filesTemplate` | func | — | Custom renderer for the file list (used with `showPreviews`). |
| `deleteButton` | bool | `true` | Show a delete icon per file (opens a confirmation modal). |
| `fileActions` | node | — | Extra action elements rendered per file in the list. |
| `onDrop` | func | — | `(acceptedFiles, rejectedFiles, event)` — rejected files are unwrapped to plain `File` objects (v9 contract). |
| `onDropAccepted` | func | — | Called with the accepted files (after the internal `onChange`). |
| `onDropRejected` | func | — | `(rejectedFiles, event)` — plain `File` objects. |
| `onRemoveFile` | func | — | `(removedFile, index, files, name)` — called after a file is deleted from the list. |
| `disableDragActive` | bool | `false` | Disable the drag-hover styles/overlay. |
| `disableClick` / `noClick` | bool | — | Prevent opening the file dialog on click (`noClick` wins if both are set). |
| `disabled` | bool | — | Disables the dropzone and hides the delete buttons. |
| `dropZoneClasses` | string | — | CSS class for the drop-target element. |
| `onClick` / `onMouseDown` | func | — | Forwarded to the drop-target element (`onClick` only in `children` mode). |
| `clearOnUnmount` | bool | `true` | Legacy prop, currently unused. |

All remaining react-dropzone props (`maxSize`, `minSize`, `noDrag`, ...) are passed through to the underlying `ReactDropzone`.

## Usage

```jsx
<Dropzone
    name="attachments"
    accept="image/*,application/pdf"
    filesLimit={3}
    multiple
    dropzoneText="Drag files here or click to browse"
    dropzoneTextHover="Drop files here..."
    value={files}
    onChange={(event) => setFiles(event.target.value)}
/>
```

Custom drop target:

```jsx
<Dropzone name="cover" accept="image/*" value={files} onChange={onChange} dropzoneTextHover="Drop it!">
    <Typography variant="h5">Drag an image anywhere in this area.</Typography>
</Dropzone>
```

## Notes

- Accepted drops are appended to the current `value` and then truncated to `filesLimit`; the component does not keep internal file state, so `value`/`onChange` must be wired up.
- Deleting a file always asks for confirmation via a modal before firing `onChange`/`onRemoveFile`.
- Files that carry a `src` property get a download link in the list; otherwise an object URL is created for image previews.
