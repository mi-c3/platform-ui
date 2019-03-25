import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import { styled } from '@material-ui/styles';

const BackgroundRed = styled('div')({
    padding: '10px',
    background: 'red',
});

storiesOf('Style', module)
    .addDecorator(withKnobs)
    .addWithJSX('styled', (props) => ( // eslint-disable-line no-unused-vars
        <Fragment>
            <div style={{ background: 'white', padding: '10px' }}>This is using in-line style.</div>
            <BackgroundRed>This is using the styled HOC.</BackgroundRed>
        </Fragment>
    ));
