# CircularProgress

Wraps [MUI CircularProgress](https://mui.com/material-ui/api/circular-progress/) and adds a `fillColor` prop for direct color customization.

## Import

```js
import { CircularProgress } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `fillColor` | string | — | `'primary'` uses the theme's dark primary color; any other value is applied directly as a CSS color (with `!important`). When omitted, standard MUI coloring applies. |
| `className` | string | — | CSS class for the root element. |

All remaining props (`size`, `variant`, `value`, ...) are passed through to the underlying MUI `CircularProgress`.

## Usage

```jsx
<CircularProgress />

<CircularProgress fillColor="#FFFFFF" size={24} />
```
