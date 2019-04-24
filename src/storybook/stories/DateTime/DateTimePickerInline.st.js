import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { DateTimePicker } from 'index';
import statefullInput from 'storybook/utils/hoc/statefullInput';

const InlineDateTimePickerSTFull = statefullInput(DateTimePicker);

storiesOf('Components.DateTimePickers', module)
    .addDecorator(withKnobs)
    .add('DateTimePicker Inline', () => {
        const label = text('Label', 'Inline', 'Default');
        const disabled = boolean('Disabled', false, 'Default');
        return <InlineDateTimePickerSTFull label={label} disabled={disabled} onClick={action('onclick')} inline />;
    });
