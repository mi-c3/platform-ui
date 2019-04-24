import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import H3 from 'storybook/components/atoms/H3';
import { Link, Typography } from 'index';

storiesOf('Components', module)
    .addDecorator(withKnobs)
    .add('Link', () => {
        const href = text('Href', '#', 'Default');
        const linkText = text('Link text', 'LINK TEXT', 'Default');
        return (
            <Fragment>
                <H3>Default link</H3>
                <Typography>
                    Check it <Link href={href}>{linkText}</Link> ;)
                </Typography>
            </Fragment>
        );
    });
