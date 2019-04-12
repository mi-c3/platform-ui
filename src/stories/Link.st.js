import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import H3 from 'stories/components/atoms/H3';
import { Link, Typography } from 'index';

storiesOf('Components', module)
    .addDecorator(withKnobs)
    .add('Link', () => (
        <Fragment>
            <H3>Default link</H3>
            <Typography>
                Check it{' '}
                <Link href={text('Href', '#', 'Default')}>
                    {text('Link text', 'LINK TEXT', 'Default')}
                </Link>{' '};)
            </Typography>
        </Fragment>
    )
    );
