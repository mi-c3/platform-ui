import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { DateTimePickerRangeModal, Grid } from 'index';

storiesOf('Components|DateTimePickers', module).add('DateTimePickerRange Modal', () => {
    return (
        <Grid container justify="space-between">
            <DateTimePickerRangeModal onChange={action('change')} label="Date time range modal" />
        </Grid>
    );
});
