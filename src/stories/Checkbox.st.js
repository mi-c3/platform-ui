import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import statefullInput from 'stories/utils/hoc/statefullInput';
import { Checkbox as CB } from 'index';

const Checkbox = statefullInput(CB);

storiesOf('Components', module)
    .addDecorator(withKnobs)
    .addWithJSX('Checkbox', () => <Checkbox
        label={text('Label', 'Active', 'Default')}
        disabled={boolean('Disabled', false, 'Default')}
        name={text('Name', 'active', 'Default')}
        onChange={action('onchange')}
    />
    );
