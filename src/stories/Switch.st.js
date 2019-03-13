import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';

import statefullInput from 'stories/utils/hoc/statefullInput';
import { Switch as S } from 'index';
import { forRadio } from 'stories/constants/propsVariation';

const Switch = statefullInput(S);

storiesOf('Components', module)
    .addDecorator(withKnobs)
    .addWithJSX('Switch', ({ value, onChange }) => (
        <Fragment>
            <Switch checked={value} onChange={onChange} label="Primary" /><br/>
            <Switch checked={value} color="secondary" label="Secondary color" /><br/>
            <Switch checked={value} disabled label="(Disabled option)" /><br/>
            <Switch
                checked={value}
                label={text('Custom', 'Custom', 'Default')}
                disabled={boolean('Disabled', false, 'Default')}
                color={select('Color', forRadio.colors, 'primary', 'Style')}
            />
        </Fragment>
    )
    );
