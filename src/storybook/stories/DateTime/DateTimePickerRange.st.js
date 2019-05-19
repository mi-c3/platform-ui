import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { DateTimePickerRange, Grid } from 'index';

storiesOf('Components|DateTimePickers', module).add('DateTimePickerRange', () => {
    return (
        <Grid container justify="space-between">
            <DateTimePickerRange onChange={action('change')} />
        </Grid>
    );
});
