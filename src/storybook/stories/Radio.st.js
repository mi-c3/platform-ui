import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import statefullInput from 'storybook/utils/hoc/statefullInput';
import { Radio, RadioGroup as RadioGroupLess } from 'index';
import { forRadio } from 'storybook/constants/propsVariation';

const RadioGroup = statefullInput(RadioGroupLess);

storiesOf('Components|Radio', module)
    .addDecorator(withKnobs)
    .add('Radio', (props) => {
        const label = text('Custom', 'Custom', 'Default');
        const disabled = boolean('Disabled', false, 'Default');
        const color = select('Color', forRadio.colors, 'primary', 'Style');

        return (
            <RadioGroup aria-label="Colors" name="colors" value={props.value || 'custom'} onChange={action('onchange')}>
                <Radio value="primary" label="Primary" />
                <Radio color="secondary" value="male" label="Secondary color" />
                <Radio color="default" value="other" label="Default color" />
                <Radio value="disabled" disabled label="(Disabled option)" />
                <Radio label={label} disabled={disabled} color={color} value="custom" />
            </RadioGroup>
        );
    });
