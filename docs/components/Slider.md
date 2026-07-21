# Slider

A wrapper around the MUI [Slider](https://mui.com/material-ui/api/slider/) with a customizable fill color and a normalized change event.

## Import

```js
import { Slider } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| fillColor | string | `'#4BB9D9'` | CSS color used for the slider (track, rail, and thumb). |
| name | string | — | Field name, echoed in the change event. |
| onChange | func | — | Called with `(event, originalEvent)` where `event.target` is `{ name, value }` and `value` is the new slider value. |

All remaining props (`value`, `min`, `max`, `step`, `marks`, `disabled`, etc.) are passed through to the underlying MUI `Slider`.

## Usage

```jsx
<Slider
    name="progress"
    value={progress}
    min={0}
    max={100}
    onChange={(event) => setProgress(event.target.value)}
/>
```
