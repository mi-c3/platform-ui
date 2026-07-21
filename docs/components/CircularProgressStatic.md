# CircularProgressStatic

A static (determinate) circular progress ring rendered as plain SVG — no MUI dependency. Shows the percentage as text in the center, or arbitrary content via `foreignObjectContent` (e.g. an `Avatar`).

## Import

```js
import { CircularProgressStatic } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | `0` | Progress percentage from 0 to 100 (rounded; out-of-range values fall back to 0). |
| `size` | number | `38` | Width/height of the SVG in px. |
| `borderWidth` | number | `3` | Stroke width of the ring in px. |
| `fillColor` | string | theme primary | Ring color. `'primary'` (or omitted) uses the theme's dark primary color; otherwise any hex/CSS color. The track behind the progress arc uses the same color with reduced opacity. |
| `priority` | number | — | When set, overrides `fillColor` with the corresponding theme priority color. |
| `disabled` | bool | — | When true, renders in the theme's disabled color. |
| `foreignObjectContent` | node | — | Content rendered inside the ring instead of the percentage text. |
| `foreignObjectProps` | object | `{}` | Props for the SVG `foreignObject` wrapper (position/size); only used with `foreignObjectContent`. |
| `className` | string | — | CSS class for the wrapper element. |

All remaining props are spread onto the wrapper `div`.

## Usage

```jsx
<CircularProgressStatic value={75} />

<CircularProgressStatic fillColor="#FF8A65" value={40} size={60} borderWidth={4} />

<CircularProgressStatic
    fillColor="primary"
    size={40}
    value={80}
    foreignObjectContent={<Avatar initials="John Doe" />}
/>
```
