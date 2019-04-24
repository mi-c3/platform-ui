import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import moment from 'moment';
import { withKnobs, text, number, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import DataTable from 'components/Table/DataTable';
import { store } from 'storybook/mock/stuff';

const columnDefinitions = [
    { field: 'id' },
    { field: 'name', header: 'Full name' },
    { field: 'age', sortable: false },
    { field: 'created', haeder: 'Registration', renderValue: ({ value }) => moment(value).format('MMMM Do YYYY') },
];

const gridSettings = {
    pageSize: 5,
    sort: [{ field: 'created', order: 'desc' }],
};
const SelectionModes = { None: null, Single: 'single', Multiple: 'multiple' };

storiesOf('Components.Tables', module)
    .addDecorator(withKnobs)
    .add('DataTable', () => (
        <Fragment>
            <DataTable
                title={text('Title', 'Customizable Data Table', 'Default')}
                data={store(number('Count of generated data', 100, {}, 'Default') + 44)}
                columnDefinitions={columnDefinitions}
                gridSettings={gridSettings}
                dataKey="id"
                selectionMode={select('Selection mode', SelectionModes, 'multiple', 'Default')}
                onSelectionChange={action('onSelectionChange')}
            />
        </Fragment>
    ));
