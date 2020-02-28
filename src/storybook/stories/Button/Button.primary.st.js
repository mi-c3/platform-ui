import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { Button, Grid } from 'index';
import { forButton } from 'storybook/constants/propsVariation';

storiesOf('Components|Button', module)
    .addDecorator(withKnobs)
    .add('Primary', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const disabledOposite = boolean('Disabled Second', true, 'Default');
        const name = text('Name', 'email', 'Default');
        const color = select('Color', forButton.colors, 'primary', 'Style');
        const size = select('Size', forButton.sizes, 'medium', 'Style');
        const variant = select('Variant', forButton.variants, 'contained', 'Style');
        const label = text('Button Text', 'Button', 'Default');
        return (
            <Grid container direction="column" justify="space-between" style={{ height: 150 }}>
                <Grid item container justify="space-around">
                    <Grid item>
                        <Button disabled={disabled} name={name} onClick={action('onclick')} color={color} size={size} variant={variant}>
                            {label}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={disabled}
                            name={name}
                            onClick={action('onclick')}
                            color={color}
                            size={size}
                            variant={variant}
                            iconName="checkbox-blank-circle"
                        >
                            {label}
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container justify="space-around">
                    <Grid item>
                        <Button disabled={disabled} name={name} onClick={action('onclick')} color={color} size={size} variant="outlined">
                            {label}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={disabled}
                            name={name}
                            onClick={action('onclick')}
                            color={color}
                            size={size}
                            variant="outlined"
                            iconName="checkbox-blank-circle"
                        >
                            {label}
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container justify="space-around">
                    <Grid item>
                        <Button
                            disabled={disabledOposite}
                            name={name}
                            onClick={action('onclick')}
                            color={color}
                            size={size}
                            iconName="checkbox-blank-circle"
                        >
                            {label}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={disabledOposite}
                            name={name}
                            onClick={action('onclick')}
                            color={color}
                            size={size}
                            variant="outlined"
                            iconName="checkbox-blank-circle"
                        >
                            {label}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    });
