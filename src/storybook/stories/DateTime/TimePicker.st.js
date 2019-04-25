import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { TimePicker, Grid } from 'index';
import stateForDateTime from 'storybook/utils/hoc/stateForDateTime';

const TimePickerFull = stateForDateTime(TimePicker);

storiesOf('Components|DateTimePickers', module)
    .addDecorator(withKnobs)
    .add('TimePicker', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const clearable = boolean('Clearable', false, 'Default');
        const inline = boolean('Inline', false, 'Default');
        const seconds = boolean('With seconds', false, 'Default');
        const showTodayButton = boolean('Show Today Button (clearebale button has higher priority)', false, 'Default');
        return (
            <Grid container justify="space-between">
                <TimePickerFull
                    label={'With Am/Pm'}
                    onClick={action('DateOnclick')}
                    minutesStep={5}
                    disabled={disabled}
                    clearable={clearable}
                    inline={inline}
                    seconds={seconds}
                    showTodayButton={showTodayButton}
                    ampm={true}
                />
                <TimePickerFull
                    label={'24 hours'}
                    onClick={action('DateOnclick')}
                    disabled={disabled}
                    clearable={clearable}
                    inline={inline}
                    seconds={seconds}
                    showTodayButton={showTodayButton}
                />
                <TimePickerFull
                    label={'Minutes Step 5'}
                    onClick={action('DateOnclick')}
                    minutesStep={5}
                    ampm={false}
                    disabled={disabled}
                    clearable={clearable}
                    inline={inline}
                    seconds={seconds}
                    showTodayButton={showTodayButton}
                />
            </Grid>
        );
    });
