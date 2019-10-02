---
id: textField
title: TextField
---

## Notes

Based on Material UI `TextField`. Full list of properties you can see in [official documentation](https://v3.material-ui.com/api/text-field/). We just changed some default props and add clearable icon button to the endAdornment.

## Props

Name      |                    Type                    | Default  | Description
--------- | :----------------------------------------: | -------- | -------------------
variant   | **enum**: 'standard', 'outlined', 'filled' | 'filled' | The variant to use.
margin    |    **enum**: 'none', 'dense', 'normal'     | 'normal' | label placement
fullWidth |                    bool                    | true     | Full width

## How to use

```javascript
import { TextField } from '@mic3/platform-ui';

<TextField
    label="First name"
    name="firstName"
    onChange={
        (event) > { this.setState({ [event.target.name]: event.target.value })}
    }
/>
```

## Storybook

<[TextField](/platform-ui/redirect?/storybook/index.html?path=/story/components-textfield--text)>
