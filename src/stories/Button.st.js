import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { Button } from 'index';
import { forButton } from 'stories/constants/propsVariation';

storiesOf('Components', module)
    .addDecorator(withKnobs)
    .add('Button', () => (
        <Button
            disabled={boolean('Disabled', false, 'Default')}
            name={text('Name', 'email', 'Default')}
            onClick={action('onclick')}

            color={select('Color', forButton.colors, 'primary', 'Style')}
            size={select('Size', forButton.sizes, 'medium', 'Style')}
            variant={select('Variant', forButton.variants, 'contained', 'Style')}
            fullWidth={boolean('FullWidth', false, 'Style')}
            mini={boolean('Mini', false, 'Style')}
        >
            {text('Button Text', 'Button', 'Default')}
        </Button>
    )
    );
