# MdiIcon

A font icon renderer built on the MUI [Icon](https://mui.com/material-ui/api/icon/) component, targeting [Material Design Icons](https://pictogrammers.com/library/mdi/) (`@mdi/font`) CSS classes.

## Import

```js
import { MdiIcon } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| name | string | — | **Required.** Icon name from the icon font (rendered as the `<type>-<name>` CSS class, e.g. `mdi-account`). |
| size | number | 24 | Applied as `fontSize`, `height`, and `width` (px). |
| color | string | — | One of the MUI `Icon` colors (`'inherit'`, `'primary'`, `'secondary'`, `'action'`, `'error'`, `'disabled'`) — forwarded as the `color` prop — or any CSS color value (hex, rgb, …), which is applied as an inline style. |
| type | string | `'mdi'` | Icon-font class prefix. Use a different value to target another icon font. |
| className | string | — | Extra class name(s), merged with the generated icon classes. |
| style | object | — | Extra inline styles, merged with the size/color styles. |

All remaining props are passed through to the underlying MUI `Icon`.

## Usage

```jsx
<MdiIcon name="weather-sunny" />
<MdiIcon name="account" size={32} color="primary" />
<MdiIcon name="alert" color="#ff9800" />
```

## Notes

- The icon font must be available in the consuming app. Install it (`npm install @mdi/font`) and import its stylesheet once, e.g.:

```js
import '@mdi/font/css/materialdesignicons.css';
```
