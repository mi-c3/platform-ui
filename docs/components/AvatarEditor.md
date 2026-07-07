# AvatarEditor

An avatar upload-and-crop widget that combines a [Dropzone](./Dropzone.md), the platform-ui [Avatar](./Avatar.md), and [react-avatar-editor](https://github.com/mosch/react-avatar-editor). Clicking (or dropping an image on) the avatar opens an inline editor with zoom and rotate controls; the cropped result is emitted as a PNG `File`.

## Import

```js
import { AvatarEditor } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | func | — | Called with a `change` event whose `target.value` is the cropped image as a `File` (`image/png`, named `<name>.png`) and `target.name` is `name`. Fired when the image first loads in the editor and again on "Crop and Upload". |
| `name` | string | — | Field name; also used for the generated file name. |
| `label` | string \| node | — | Text shown next to the avatar (or as the button label when `isButton` is true). |
| `image` | string | — | Current image URL, passed as `src` to the `Avatar`. |
| `initials` | string | — | Fallback initials for the `Avatar` when there is no image. |
| `disabled` | bool | — | Prevents opening the file picker by click. |
| `isButton` | bool | — | Render an upload `Button` (with an `upload` icon unless `EditButtonProps.withoutIcon` is set) instead of the avatar. |
| `AvatarProps` | object | `{}` | Props for the `Avatar`. |
| `ReactAvatarEditorProps` | object | `{}` | Props for the underlying `react-avatar-editor` (e.g. `width`, `height`, `borderRadius`). |
| `EditorProps` | object | `{}` | Editor options: `disableZoom` (hide the zoom slider), `disableRotate` (hide the rotate buttons), `cancelLabel` (default `'Cancel'`), `uploadLabel` (default `'Crop and Upload'`). |
| `EditButtonProps` | object | `{}` | Props for the edit `Button`. `label` renders an extra edit button next to the avatar; `withoutIcon` removes the icon in `isButton` mode. |
| `GridProps` | object | `{}` | Props for the root MUI `Grid` container. |
| `AvatarGridProps` | object | `{}` | Props for the `Grid` wrapping the avatar and label. |
| `cancelUpload` | func | — | Called when the user cancels the editor. |
| `onImageLoad` | func | — | Called after the initial (non-final) `onChange` when the image is ready in the editor. |

## Usage

```jsx
<AvatarEditor
    label="User Avatar"
    name="avatar"
    initials={user.name}
    image={user.imageUrl}
    onChange={(event) => setAvatarFile(event.target.value)}
/>

<AvatarEditor
    name="image"
    initials={name}
    image={image}
    EditButtonProps={{ label: 'Edit Profile Image' }}
    GridProps={{ alignItems: 'center' }}
    AvatarProps={{ style: { width: 200, height: 200 } }}
    onChange={(event) => setImage(event.target.value)}
/>
```

## Notes

- Only image files are accepted (`accept="image/*"`); non-image drops are ignored.
- Zoom is clamped to a scale of 1–4; rotation happens in 90 degree steps.
- `onChange` fires twice per edit session: once when the image is ready in the editor (state kept open) and once when the user confirms the crop (editor closes).
- `EditorProps.diabelRotate` (a legacy typo) is still honored as a deprecated alias for `EditorProps.disableRotate`; use `disableRotate` in new code.
