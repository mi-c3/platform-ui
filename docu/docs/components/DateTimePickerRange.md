---
id: dateTimePickerRange
title: DateTimePickerRange
---

## Notes

Based on `TextField` and two `DateTimePicker`'s'.

All properties passing to `TextField`.

## Props

Name             |  Type  | Default | Description
---------------- | :----: | ------- | ------------------------------------
PickersFromProps | object |         | Properties for first DateTimePicker
PickersToProps   | object |         | Properties for second DateTimePicker

## How to use

```javascript
import { DateTimePickerRange } from '@mic3/platform-ui';

<DateTimePicker
    label={'Date Time Picker Range'}
    value={[
        moment().format('LLL').toDate(), // start date
        moment().add(2, 'hours').format('LLL').toDate() // end date
    ]}
    onChange={onChange}
    clearable
/>
```

## Storybook

<[DateTimePickerRange](/platform-ui/redirect?/storybook/index.html?path=/story/components-datetimepickers--datetimepickerrange)>
