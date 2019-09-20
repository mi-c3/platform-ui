---
id: timePicker
title: TimePicker
---

## Notes

Using `TimePicker` from [material-ui-pickers](https://material-ui-pickers-v2.dmtr-kovalenko.now.sh/api/timepicker) `v2.2.4`.

Was rewrote `onChange` in `event.target.value` we put value.

## Props

Name      |                    Type                    | Default  | Description
--------- | :----------------------------------------: | -------- | ------------------------------------------------------------
label     |                   string                   |          | Label for the field
clearable |                    bool                    | false    | If true, if will add clearable button to the field and popup
inline    |                    bool                    | false    | If true, the field will be inline
variant   | **enum**: 'standard', 'outlined', 'filled' | 'filled' | The variant to use.
margin    |    **enum**: 'none', 'dense', 'normal'     | 'normal' | label placement
fullWidth |                    bool                    | true     | Full width

## How to use

```javascript
import { TimePicker } from '@mic3/platform-ui';

<TimePicker
    value={value}
    onChange={onChange}
    label={'Time Picker'}
    clearable
/>
```

## Storybook

<[TimePicker](/redirect?/storybook/index.html?path=/story/components-datetimepickers--timepicker)>
