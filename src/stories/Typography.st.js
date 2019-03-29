import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select } from '@storybook/addon-knobs';

import { Typography } from 'index';
import H3 from 'stories/components/atoms/H3';
import { forTypography } from 'stories/constants/propsVariation';

storiesOf('Components', module)
    .addDecorator(withKnobs)
    .addWithJSX('Typography', () => (
        <Fragment>
            <H3>Display text</H3>
            <Typography
                variant={select('Variant', forTypography.variant, 'caption', 'Default')}
            >
                {text('Display Text', 'You can write any text here', 'Default')}
            </Typography>
        </Fragment>
    ));
