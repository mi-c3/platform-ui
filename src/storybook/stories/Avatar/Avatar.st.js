import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import { Avatar } from 'index';

storiesOf('Components|Avatar', module)
    .addDecorator(withKnobs)
    .add('Avatar', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const initials = text('Initials', 'A F', 'Default');
        const src = text('Src', '', 'Default');
        return (
            <Fragment>
                <Avatar src={src} initials={initials} />
                <br />
                <Avatar src="https://v3.material-ui.com/static/images/avatar/1.jpg" initials={initials} name={name} disabled={disabled} />;
            </Fragment>
        );
    });

storiesOf('Components|Avatar', module)
    .addDecorator(withKnobs)
    .add('Avatar broken', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const initials = text('Initials', 'A F', 'Default');
        return <Avatar src="https://v3.material-ui.com/static/images/avatar/11.jpg" initials={initials} name={name} disabled={disabled} />;
    });
