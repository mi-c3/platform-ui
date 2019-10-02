---
id: button
title: Button
---

## Notes

Component `Button` based on Material UI `Button`. All properties you can see in [official documentation](https://v3.material-ui.com/api/button/)

## Props

Name     |                          Type                          | Default     | Description
-------- | :----------------------------------------------------: | ----------- | ----------------------------------------------------------------------------------------------
iconName |                         string                         | null        | Icon name for rendering `Button` with `MdiIcon`
color    | **enum**: 'default', 'inherit', 'primary', 'secondary' | 'primary'   | The color of the component. It supports those theme colors that make sense for this component.
variant  |       **enum**: 'text', 'outlined', 'contained'        | 'contained' | Variant of button

## How to use

```javascript
import { Button } from '@mic3/platform-ui';

<Button src={src} initials={initials} />
```

## Storybook

<[Button](/platform-ui/redirect?/storybook/index.html?path=/story/components-button--primary)>
