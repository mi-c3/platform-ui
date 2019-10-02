---
id: avatarEditor
title: AvatarEditor
---

## Notes

Using `ReactAvatarEditor` from [react-avatar-editor](https://github.com/mosch/react-avatar-editor).

## Props

Name                   |  Type  | Default | Description
---------------------- | :----: | ------- | ------------------------------------------------
label                  | string |         | Label for the field
name                   | string |         | Name of the field
disabled               |  bool  | false   | If true, the field will be disabled
withEditButton         |  bool  | false   | Show/Hide edit button
image                  | string |         | `src` for `Avatar` component
initials               | string |         | `initials` for `Avatar` component
AvatarProps            | object |         | Properties for `Avatar` component
ReactAvatarEditorProps | object |         | Properties for `ReactAvatarEditor` component
EditButtonProps        | object |         | Properties for Edit `Button` component
GridProps              | object |         | Properties root `Grid` wrapper
AvatarGridProps        | object |         | Properties for `Grid` component `Avatar` wrapper

## How to use

```javascript
import { AvatarEditor } from '@mic3/platform-ui';

<AvatarEditor
    label="User Avatar"
    name="avatar"
    initials={firstName}
    onChange={
        (event) > { this.setState({ [event.target.name]: event.target.value })}
    }
/>

<AvatarEditor
    name="image"
    initials={name}
    image={image}
    EditButtonProps={{
        label: 'Edit Profile Image'
    }}
    GridProps={{
        alignItems: 'center',
    }}
    AvatarGridProps={{
        direction: 'column',
        justify: 'space-around'
    }}
    AvatarProps={{
        style: {
            width: '200px',
            height: '200px'
        }
    }}
    onChange={
        (event) > { this.setState({ [event.target.name]: event.target.value })}
    }
/>
```

## Storybook

<[AvatarEditor](/platform-ui/redirect?/storybook/index.html?path=/story/components-avatar--avatar-editor)>
