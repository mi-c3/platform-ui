# TextEditor

A markdown editor with write/preview tabs, wrapping the `ReactMde` component from [react-mde](https://github.com/andrerpena/react-mde). The change event is normalized to the `{ target: { name, value } }` shape, and the markdown preview is generated internally.

## Import

```js
import { TextEditor } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| value | string | `''` | Markdown content. Kept in internal state and synced when the prop changes. |
| name | string | — | Field name, echoed in the change event. |
| onChange | func | — | Called with `{ target: { name, value } }`. An empty editor reports `value: null`. |
| previewDefault | bool | false | Start in (and switch to) the preview tab instead of the write tab. |
| disabled | bool | false | Forces preview mode and hides the editor toolbar. |

All remaining props are passed through to the underlying `ReactMde` component.

## Usage

```jsx
<TextEditor
    name="description"
    value={description}
    onChange={(event) => setDescription(event.target.value)}
/>
```

## Notes

- Only one tab button is shown at a time: "Preview" while writing, "Write" while previewing (the toolbar is hidden in preview mode).
- `generateMarkdownPreview` and `onTabChange` are handled internally.
