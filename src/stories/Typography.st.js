import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import { Typography } from 'index';
import H3 from 'stories/components/atoms/H3';

storiesOf('Components', module)
    .addDecorator(withKnobs)
    .addWithJSX('Typography', () => (
        <Fragment>
            <H3>Display text</H3>
            <Typography>
                {text('Display Text', 'You can write any text here', 'Default')}
            </Typography>
        </Fragment>
    ));
