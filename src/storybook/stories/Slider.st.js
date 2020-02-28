import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import { Grid, Slider as SliderPui } from 'index';
import statefullInput from 'storybook/utils/hoc/statefullInput';

const Slider = statefullInput(SliderPui);

storiesOf('Components|Slider', module)
    .addDecorator(withKnobs)
    .add('Slider', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const discrete = boolean('discrete', true, 'Default');
        const showMarkers = boolean('ShowMarkers', false, 'Default');
        const name = text('Name', 'slider', 'Default');
        const label = text('Label', 'Slider', 'Default');
        const fillColor = text('Pass hex color', '', 'Default');

        const props = {};
        const enablePriority = boolean('Enable priority', false, 'Priority');
        if (enablePriority) {
            props.priority = number('Priority', 3, {}, 'Priority');
        }
        return (
            <Grid container direction="column" justify="space-between" style={{ height: 150, paddingTop: '3rem' }}>
                <Grid item container justify="space-around">
                    <Grid item md={6} sm={6} xs={6}>
                        <Slider
                            fillColor={fillColor}
                            label={label}
                            name={name}
                            disabled={disabled}
                            value={75}
                            discrete={discrete}
                            showMarkers={showMarkers}
                            {...props}
                        />
                    </Grid>
                </Grid>
            </Grid>
        );
    });
