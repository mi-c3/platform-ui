import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select } from '@storybook/addon-knobs';

import { Typography } from 'index';
import H3 from 'storybook/components/atoms/H3';
import { forTypography } from 'storybook/constants/propsVariation';

storiesOf('Components|Typography', module)
    .addDecorator(withKnobs)
    .add('Typography', () => {
        const variant = select('Variant', forTypography.variant, 'caption', 'Default');
        const typographyText = text('Display Text', 'You can write any text here', 'Default');
        return (
            <Fragment>
                <H3>Display text</H3>
                <Typography variant={variant}>{typographyText}</Typography>
            </Fragment>
        );
    });
