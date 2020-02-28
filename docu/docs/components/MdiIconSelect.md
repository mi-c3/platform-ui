---
id: mdiIconSelect
title: MdiIconSelect
---

## Notes

Based on [Autocomplete](/docs/components/autocomplete) component.

Have to be preinstalled `2.5.94` version of icons library `yarn add @mdi/font@2.5.94` and add to the root `index.js` of your project:

```javascript
import '~@mdi/font/css/materialdesignicons.css';
```

## How to use

```javascript
import { MdiIconSelect } from '@mic3/platform-ui';

<MdiIconSelect
    label="Choose icon"
    name="icon"
    onChange={onChange}
    valueField="value"
    fullWidth
/>
```

## Storybook

<[MdiIcon](/platform-ui/redirect?/storybook/index.html?path=/story/components-autocomplete--mdiiconselect)>
