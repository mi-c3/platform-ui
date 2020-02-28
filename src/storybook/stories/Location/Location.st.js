import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';
import { onClick } from 'storybook/utils/action/action';

import H3 from 'storybook/components/atoms/H3';
import Location from 'components/Location/Location';

storiesOf('Components|Location', module)
    .addDecorator(withKnobs)
    .add('Location', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const latitude = number('Latitude', 35.8879817, { range: true, min: 0, max: 90 }, 'Default');
        const longitude = number('Longitude', 14.483987899999997, { range: true, min: 0, max: 90 }, 'Default');
        return (
            <Fragment>
                <H3>Location</H3>
                <Location latitude={latitude} longitude={longitude} disabled={disabled} onClick={onClick} />
            </Fragment>
        );
    });
