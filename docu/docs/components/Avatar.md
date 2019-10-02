---
id: avatar
title: Avatar
---

## Notes

Component `Avatar` based on Material UI `Avatar`. All properties you can see in [official documentation](https://v3.material-ui.com/api/avatar/)

## Props

Name                        |  Type  | Default | Description
--------------------------- | :----: | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------
initials                    | string | null    | value for filtering results
initialsSeparator           | string | (space) | separator for parsing initials properties
CircularProgressStaticProps | object | {}      | props for `CircularProgressStatic`, if `CircularProgressStaticProps={ value: 'is not null' }` rendering `Avatar` will be with `CircularProgressStatic` circle

## How to use

```javascript
import { Avatar } from '@mic3/platform-ui';

<Avatar src={src} initials={initials} />
```

## Storybook

<[Avatar](/platform-ui/redirect?/storybook/index.html?path=/story/components-avatar--avatar)>
