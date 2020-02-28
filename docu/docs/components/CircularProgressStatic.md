---
id: circularProgressStatic
title: CircularProgressStatic
---

## Notes

Component `CircularProgressStatic` for static circular progress bar.

## Props

Name                 |       Type       | Default | Description
-------------------- | :--------------: | ------- | ---------------------------------------------------------------------------------------
size                 |      number      | 38      | circle radius in `px`
borderWidth          |      number      | 3       | width of border
value                |      number      | 0       | value can be from 0 to 100
fillColor            | HEX or CSS color | white   | color of bar
foreignObjectContent |       node       | null    | render component inside svg
foreignObjectProps   |      object      | {}      | properties for svg `foreignObject` tag, available if `foreignObjectContent` is not null

## How to use

```javascript
import { CircularProgressStatic } from '@mic3/platform-ui';

<CircularProgressStatic fillColor="#FFFFFF" value={75} />

<CircularProgressStatic
    fillColor="primary"
    size={40}
    foreignObjectContent={<Avatar {...avatarProps} />}
/>
```
