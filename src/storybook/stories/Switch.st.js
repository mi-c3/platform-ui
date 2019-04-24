import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';

import statefullInput from 'storybook/utils/hoc/statefullInput';
import { Switch as S } from 'index';
import { forRadio } from 'storybook/constants/propsVariation';

const Switch = statefullInput(S);

storiesOf('Components', module)
    .addDecorator(withKnobs)
    .add('Switch', ({ value, onChange }) => {
        const label = text('Custom', 'Custom', 'Default');
        const disabled = boolean('Disabled', false, 'Default');
        const color = select('Color', forRadio.colors, 'primary', 'Style');

        return (
            <Fragment>
                <Switch value={value} onChange={onChange} label="Primary" name="primary" />
                <br />
                <Switch value={value} color="secondary" label="Secondary color" name="secondary" />
                <br />
                <Switch value={value} disabled label="(Disabled option)" name="disabled" />
                <br />
                <Switch value={value} label={label} disabled={disabled} color={color} />
            </Fragment>
        );
    });
