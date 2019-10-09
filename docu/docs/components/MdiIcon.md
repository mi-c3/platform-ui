---
id: mdiIcon
title: MdiIcon
---

## Notes

Based on `MuiIcon` component and [materialdesignicons](https://materialdesignicons.com/).

Icons have to be preinstalled `yarn add @mdi/font` and add to the root `index.js` of your project:

```javascript
import '~@mdi/font/css/materialdesignicons.css';
```

## Props

Name  |  Type  | Default   | Description
----- | :----: | --------- | --------------------------------------------------------------------------------------------------------
size  | number | 24        | The fontSize applied to the icon. Defaults to `24px`
name  | string |           | Name of the MaterialDisignIcons icon. Required property.
color | string | 'inherit' | Can be one of MUI colors `['inherit', 'primary', 'secondary', 'action', 'error', 'disabled']` or any hex

## How to use

```javascript
import { MdiIcon } from '@mic3/platform-ui';

<MdiIcon name="weather-sunny" />
```

## Storybook

<[MdiIcon](/platform-ui/redirect?/storybook/index.html?path=/story/components-mdiicon--mdiicon)>
