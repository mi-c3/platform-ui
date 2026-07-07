# Link

A thin wrapper around the MUI [Link](https://mui.com/material-ui/api/link/) component. When the `to` prop is set, it renders through `react-router-dom`'s `Link` (via MUI's `component` prop) so navigation is handled by the router; otherwise it behaves as a plain MUI `Link`.

## Import

```js
import { Link } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| to | string | undefined | Router destination (pathname, search, and hash). When set, the link is rendered through `react-router-dom`'s `Link`. When omitted, use `href` as with a normal MUI `Link`. |

All remaining props are passed through to the underlying MUI `Link`.

## Usage

```jsx
// External link
<Link href="https://mui.com/" target="_blank">MUI</Link>

// Router link
<Link to="/about">About</Link>
```
