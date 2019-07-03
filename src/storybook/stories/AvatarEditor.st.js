import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { AvatarEditor } from 'index';

storiesOf('Components|AvatarEditor', module)
    .addDecorator(withKnobs)
    .add('Avatar editor', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const label = text('Label', 'Image uploader', 'Default');
        const initials = text('Initials', 'A V', 'Default');
        return <AvatarEditor initials={initials} name={name} onChange={action('onchange')} label={label} disabled={disabled} />;
    });
