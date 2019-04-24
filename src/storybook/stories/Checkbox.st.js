import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import statefullInput from 'storybook/utils/hoc/statefullInput';
import { Checkbox as CB } from 'index';

const Checkbox = statefullInput(CB);

storiesOf('Components', module)
    .addDecorator(withKnobs)
    .add('Checkbox', () => {
        const label = text('Label', 'Active', 'Default');
        const disabled = boolean('Disabled', false, 'Default');
        const name = text('Name', 'active', 'Default');
        return <Checkbox label={label} disabled={disabled} name={name} onChange={action('onchange')} />;
    });
