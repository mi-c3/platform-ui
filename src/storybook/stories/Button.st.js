import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { Button } from 'index';
import { forButton } from 'storybook/constants/propsVariation';

storiesOf('Components', module)
    .addDecorator(withKnobs)
    .add('Button', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const name = text('Name', 'email', 'Default');
        const color = select('Color', forButton.colors, 'primary', 'Style');
        const size = select('Size', forButton.sizes, 'medium', 'Style');
        const variant = select('Variant', forButton.variants, 'contained', 'Style');
        const fullWidth = boolean('FullWidth', false, 'Style');
        const mini = boolean('Mini', false, 'Style');
        const label = text('Button Text', 'Button', 'Default');
        return (
            <Button
                disabled={disabled}
                name={name}
                onClick={action('onclick')}
                color={color}
                size={size}
                variant={variant}
                fullWidth={fullWidth}
                mini={mini}
            >
                {label}
            </Button>
        );
    });
