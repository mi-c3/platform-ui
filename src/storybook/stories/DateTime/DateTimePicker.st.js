import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { DateTimePicker } from 'index';
import statefullInput from 'storybook/utils/hoc/statefullInput';

const DateTimePickerSTFull = statefullInput(DateTimePicker);

storiesOf('Components|DateTimePickers', module)
    .addDecorator(withKnobs)
    .add('DateTimePicker', () => {
        const label = text('Label', 'Default', 'Default');
        const disabled = boolean('Disabled', false, 'Default');
        const clearable = boolean('Clearable', false, 'Default');
        const showTodayButton = boolean('Show Today Button (clearebale button has higher priority)', false, 'Default');

        return (
            <DateTimePickerSTFull
                clearable={clearable}
                showTodayButton={showTodayButton}
                label={label}
                disabled={disabled}
                onClick={action('onclick')}
            />
        );
    });
