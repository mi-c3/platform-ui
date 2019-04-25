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
        return <DateTimePickerSTFull label={label} disabled={disabled} onClick={action('onclick')} />;
    });
