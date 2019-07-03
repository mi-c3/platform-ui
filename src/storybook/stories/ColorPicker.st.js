import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import statefullInput from 'storybook/utils/hoc/statefullInput';
import { ColorPicker as CP } from 'index';

const ColorPicker = statefullInput(CP);

storiesOf('Components|ColorPicker', module)
    .addDecorator(withKnobs)
    .add('Color picker', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const name = text('Name', 'email', 'Default');
        const label = text('Label', 'Choose color', 'Default');
        return <ColorPicker label={label} disabled={disabled} name={name} onChange={action('onchange')} />;
    });
