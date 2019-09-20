---
id: datePicker
title: DatePicker
---

## Notes

Using `DatePicker` from [material-ui-pickers](https://material-ui-pickers-v2.dmtr-kovalenko.now.sh/api/datepicker) `v2.2.4`.

Was rewrote `onChange` in `event.target.value` we put value.

## Props

Name                 |                    Type                    | Default  | Description
-------------------- | :----------------------------------------: | -------- | ------------------------------------------------------------
label                |                   string                   |          | Label for the field
clearable            |                    bool                    | false    | If true, if will add clearable button to the field and popup
inline               |                    bool                    | false    | If true, the field will be inline
animateYearScrolling |                    bool                    | true     |
variant              | **enum**: 'standard', 'outlined', 'filled' | 'filled' | The variant to use.
margin               |    **enum**: 'none', 'dense', 'normal'     | 'normal' | label placement
fullWidth            |                    bool                    | true     | Full width

## How to use

```javascript
import { DatePicker } from '@mic3/platform-ui';

<DatePicker
    value={value}
    onChange={onChange}
    label={'Date Picker'}
    minDate={new Date()}
    showTodayButton
    disablePast
    clearable
/>
```

## Storybook

<[DatePicker](/redirect?/storybook/index.html?path=/story/components-datetimepickers--datepicker)>
