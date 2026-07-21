# Avatar

Wraps [MUI Avatar](https://mui.com/material-ui/api/avatar/). When no image `src` is given it renders initials on a background color generated deterministically from the `initials` string. It can optionally be surrounded by a static circular progress ring.

## Import

```js
import { Avatar } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | — | Image URL. Takes precedence over `initials`. |
| `initials` | string | — | Text used to build the initials (e.g. a full name) and to pick one of the built-in avatar colors. Only used when `src` is empty. |
| `initialsSeparator` | string | space | Separator used to split `initials` into words before taking the first letters. |
| `CircularProgressStaticProps` | object | `{}` | Props for a surrounding [`CircularProgressStatic`](./CircularProgressStatic.md) ring. The ring is rendered only when `CircularProgressStaticProps.value` is defined; the avatar is then shrunk to 28x28px inside a 40px ring (`fillColor: 'primary'` by default). |
| `className` | string | — | CSS class for the avatar (or, when the progress ring is shown, for the inner avatar; use `CircularProgressStaticProps.className` for the ring). |

All remaining props are passed through to the underlying MUI `Avatar`.

## Usage

```jsx
<Avatar src="https://example.com/photo.jpg" />

<Avatar initials="John Doe" />

<Avatar
    initials="John Doe"
    CircularProgressStaticProps={{ value: 75 }}
/>
```
