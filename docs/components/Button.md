# Button

Wraps [MUI Button](https://mui.com/material-ui/api/button/) with different defaults (`variant="contained"`, `color="primary"`), an optional leading MDI icon, and built-in link support via the platform-ui `Link` component.

## Import

```js
import { Button } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `iconName` | string | — | Renders a leading `MdiIcon` with this name inside the button. |
| `iconType` | string | `'mdi'` | Icon set passed to `MdiIcon` when `iconName` is set. |
| `color` | string | `'primary'` | MUI Button color. |
| `variant` | `'text'` \| `'outlined'` \| `'contained'` | `'contained'` | MUI Button variant. |
| `to` | string | — | Renders the button as a `Link` (router navigation). |
| `href` | string | — | Renders the button as a `Link` with a plain href. |
| `classes` | object | — | `classes.icon` is applied to the leading icon. |
| `children` | node | — | Button content. |

All remaining props are passed through to the underlying MUI `Button`.

## Usage

```jsx
<Button onClick={onSave}>Save</Button>

<Button iconName="upload" variant="outlined" onClick={onUpload}>
    Upload
</Button>

<Button to="/settings" variant="text">Settings</Button>
```
