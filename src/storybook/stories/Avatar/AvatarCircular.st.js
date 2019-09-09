import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import { Avatar } from 'index';

storiesOf('Components|Avatar', module)
    .addDecorator(withKnobs)
    .add('Avatar Circular', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const initials = text('Initials', 'A V', 'Default');
        const fillColor = text('Fill color', '#81C784', 'Default');
        const circularValue = number('Circular progress value', 75, 'Default');
        return (
            <Avatar
                CircularProgressStaticProps={{
                    value: circularValue,
                    fillColor,
                }}
                src="https://v3.material-ui.com/static/images/avatar/1.jpg"
                initials={initials}
                name={name}
                disabled={disabled}
            />
        );
    });
