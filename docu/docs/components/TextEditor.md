---
id: textEditor
title: TextEditor
---

## Notes

Using `ReactMde` component from [react-mde](https://github.com/andrerpena/react-mde).

Was rewrote `onChange` in `event.target` we put `value` and `name`.

## How to use

```javascript
import { TextEditor } from '@mic3/platform-ui';

<TextEditor
    label="User Avatar"
    name="description"
    value={description}
    onChange={
        (event) > { this.setState({ [event.target.name]: event.target.value })}
    }
/>
```

## Storybook

<[TextEditor](/platform-ui/redirect?/storybook/index.html?path=/story/components-editors--texteditor)>
