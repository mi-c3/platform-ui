import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, date } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { DatePicker, Grid } from 'index';
import statefullInput from 'storybook/utils/hoc/statefullInput';

const DatePickerFull = statefullInput(DatePicker);

storiesOf('Components.DateTimePickers', module)
    .addDecorator(withKnobs)
    .add('DatePicker', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const disableFuture = boolean('Disabled Future', false, 'Default');
        const disablePast = boolean('Disabled Past', false, 'Default');
        const maxDate = date('Max Date', new Date('Jan 20 2020'), 'Default');
        const minDate = date('Min Date', new Date('Jan 20 2017'), 'Default');
        const clearable = boolean('Clearable', false, 'Default');
        const inline = boolean('Inline', false, 'Default');
        const showTodayButton = boolean('Show Today Button (clearebale button has higher priority)', false, 'Default');
        return (
            <Grid container justify="space-between">
                <DatePickerFull
                    label={'Date Picker'}
                    onClick={action('DateOnclick')}
                    disabled={disabled}
                    disableFuture={disableFuture}
                    disablePast={disablePast}
                    maxDate={maxDate}
                    minDate={minDate}
                    clearable={clearable}
                    inline={inline}
                    showTodayButton={showTodayButton}
                />
                <DatePickerFull
                    label={'Month'}
                    onClick={action('MonthOnclick')}
                    disabled={disabled}
                    disableFuture={disableFuture}
                    disablePast={disablePast}
                    maxDate={maxDate}
                    minDate={minDate}
                    clearable={clearable}
                    inline={inline}
                    showTodayButton={showTodayButton}
                    views={['month']}
                />
                <DatePickerFull
                    label={'Year'}
                    onClick={action('YearOnclick')}
                    disabled={disabled}
                    disableFuture={disableFuture}
                    disablePast={disablePast}
                    maxDate={maxDate}
                    minDate={minDate}
                    clearable={clearable}
                    inline={inline}
                    showTodayButton={showTodayButton}
                    views={['year']}
                />
                <DatePickerFull
                    label={'Year and Mont'}
                    onClick={action('YearMontOnclick')}
                    disabled={disabled}
                    disableFuture={disableFuture}
                    disablePast={disablePast}
                    maxDate={maxDate}
                    minDate={minDate}
                    clearable={clearable}
                    inline={inline}
                    showTodayButton={showTodayButton}
                    views={['year', 'month']}
                />
            </Grid>
        );
    });
