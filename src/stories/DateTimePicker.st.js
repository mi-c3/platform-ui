import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, date } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { DateTimePicker, TimePicker, DatePicker, Grid } from 'index';
import stateForDateTime from 'stories/utils/hoc/stateForDateTime';
import statefullInput from 'stories/utils/hoc/statefullInput';

const DateTimePickerSTFull = statefullInput(DateTimePicker);
const InlineDateTimePickerSTFull = statefullInput(DateTimePicker);
const DatePickerFull = stateForDateTime(DatePicker);
const TimePickerFull = stateForDateTime(TimePicker);

storiesOf('Components.DateTimePickers', module)
    .addDecorator(withKnobs)
    .addWithJSX('DateTimePicker', () => (
        <DateTimePickerSTFull
            label={text('Label', 'Default', 'Default')}
            disabled={boolean('Disabled', false, 'Default')}
            onClick={action('onclick')}
        />
    )
    );

storiesOf('Components.DateTimePickers', module)
    .addDecorator(withKnobs)
    .addWithJSX('DateTimePicker Inline', () => (
        <InlineDateTimePickerSTFull
            label={text('Label', 'Inline', 'Default')}
            disabled={boolean('Disabled', false, 'Default')}
            onClick={action('onclick')}
            inline
        />
    )
    );

storiesOf('Components.DateTimePickers', module)
    .addDecorator(withKnobs)
    .addWithJSX('DatePicker', () => {
        const defaultProps = {
            disabled: boolean('Disabled', false, 'Default'),
            disableFuture: boolean('Disabled Future', false, 'Default'),
            disablePast: boolean('Disabled Past', false, 'Default'),
            maxDate: date('Max Date', new Date('Jan 20 2020'), 'Default'),
            minDate: date('Min Date', new Date('Jan 20 2017'), 'Default'),
            clearable: boolean('Clearable', false, 'Default'),
            inline: boolean('Inline', false, 'Default'),
            showTodayButton: boolean('Show Today Button (clearebale button has higher priority)', false, 'Default'),
        };
        return (
            <Grid container justify="space-between"  >
                <DatePickerFull
                    label={'Date Picker'}
                    onClick={action('DateOnclick')}
                    {...defaultProps}
                />
                <DatePickerFull
                    label={'Month'}
                    onClick={action('MonthOnclick')}
                    {...defaultProps}
                    views={['month']}
                />
                <DatePickerFull
                    label={'Year'}
                    onClick={action('YearOnclick')}
                    {...defaultProps}
                    views={['year']}
                />
                <DatePickerFull
                    label={'Year and Mont'}
                    onClick={action('YearMontOnclick')}
                    {...defaultProps}
                    views={['year', 'month']}
                />
            </Grid>
        );
    }
    );

storiesOf('Components.DateTimePickers', module)
    .addDecorator(withKnobs)
    .addWithJSX('TimePicker', () => {
        const defaultProps = {
            disabled: boolean('Disabled', false, 'Default'),
            clearable: boolean('Clearable', false, 'Default'),
            inline: boolean('Inline', false, 'Default'),
            seconds: boolean('With seconds', false, 'Default'),
            showTodayButton: boolean('Show Today Button (clearebale button has higher priority)', false, 'Default'),
        };
        return (
            <Grid container justify="space-between"  >
                <TimePickerFull
                    label={'With Am/Pm'}
                    onClick={action('DateOnclick')}
                    minutesStep={5}
                    {...defaultProps}
                    ampm={true}
                />
                <TimePickerFull
                    label={'24 hours'}
                    onClick={action('DateOnclick')}
                    {...defaultProps}
                />
                <TimePickerFull
                    label={'Minutes Step 5'}
                    onClick={action('DateOnclick')}
                    minutesStep={5}
                    ampm={false}
                    {...defaultProps}
                />
            </Grid>
        );
    }
    );
