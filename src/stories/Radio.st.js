import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import statefullInput from 'stories/utils/hoc/statefullInput';
import { Radio, RadioGroup as RadioGroupLess } from 'index';
import { forRadio } from 'stories/constants/propsVariation';

const RadioGroup = statefullInput(RadioGroupLess);


storiesOf('Components', module)
    .addDecorator(withKnobs)
    .addWithJSX('Radio', (props) => (
        <RadioGroup
            aria-label="Colors"
            name="colors"
            value={props.value || 'custom'}
            onChange={action('onchange')}
        >
            <Radio value="primary" label="Primary" />
            <Radio color="secondary" value="male" label="Secondary color" />
            <Radio color="default" value="other" label="Default color" />
            <Radio value="disabled" disabled label="(Disabled option)" />
            <Radio
                label={text('Custom', 'Custom', 'Default')}
                disabled={boolean('Disabled', false, 'Default')}
                color={select('Color', forRadio.colors, 'primary', 'Style')}
                value="custom"
            />
        </RadioGroup>
    ));
