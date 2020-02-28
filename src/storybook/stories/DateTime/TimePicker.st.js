import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { TimePicker, Grid } from 'index';
import statefullInput from 'storybook/utils/hoc/statefullInput';

const TimePickerFull = statefullInput(TimePicker);

storiesOf('Components|DateTimePickers', module)
    .addDecorator(withKnobs)
    .add('TimePicker', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const clearable = boolean('Clearable', false, 'Default');
        const showTodayButton = boolean('Show Today Button (clearebale button has higher priority)', false, 'Default');
        return (
            <Grid container justify="space-between">
                <TimePickerFull
                    label={'With Am/Pm'}
                    onClick={action('DateOnclick')}
                    minutesStep={5}
                    disabled={disabled}
                    clearable={clearable}
                    showTodayButton={showTodayButton}
                    ampm={true}
                />
                <TimePickerFull
                    label={'24 hours'}
                    onClick={action('DateOnclick')}
                    disabled={disabled}
                    clearable={clearable}
                    showTodayButton={showTodayButton}
                />
                <TimePicker
                    label={'Minutes Step 5'}
                    onClick={action('DateOnclick')}
                    minutesStep={5}
                    ampm={false}
                    disabled={disabled}
                    clearable={clearable}
                    showTodayButton={showTodayButton}
                />
            </Grid>
        );
    });
