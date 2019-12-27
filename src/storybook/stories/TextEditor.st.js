import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import TextEditor from 'components/TextEditor';

storiesOf('Components|Editors', module)
    .addDecorator(withKnobs)
    .add('TextEditor', () => (
        <Fragment>
            <TextEditor onChange={action('onChange')} />
        </Fragment>
    ));
