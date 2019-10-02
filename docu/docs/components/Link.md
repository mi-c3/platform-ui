---
id: link
title: Link
---

## Notes

Basically it's `MuiLink` component. But if properties `to` is defined `Link` from `react-router-dom` will wrapped in `MuiLink`.

## Props

Name |  Type  | Default   | Description
---- | :----: | --------- | ----------------------------------------------------------------------------------------------------------------------------
to   | string | undefined | A string representation of the Link location, created by concatenating the location's pathname, search, and hash properties.

## How to use

```javascript
import { Link } from '@mic3/platform-ui';

<Link href="https://v3.material-ui.com/api/link/" target="blank" />

<Link to="/about" />
```

## Storybook

<[Link](/platform-ui/redirect?/storybook/index.html?path=/story/components-link--link)>
