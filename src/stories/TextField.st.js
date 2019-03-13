import React, { Fragment } from 'react';
import memoize from 'memoize-one';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import statefullInput from 'stories/utils/hoc/statefullInput';
import { currencies } from 'stories/mock/currencies';
import { TextField as TF, MenuItem } from 'index';
import H3 from 'stories/components/atoms/H3';

const TextField = statefullInput(TF);

const generateOptions = memoize((currencies) => currencies.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>));

const optionsVariant = {
    Standard: 'standard',
    Filled: 'filled',
    Outlined: 'outlined',
};
const optionsMargin = {
    None: 'none',
    Dense: 'dense',
    Normal: 'normal',
};

storiesOf('Components.TextField', module)
    .addDecorator(withKnobs)
    .addWithJSX('Text', () => (
        <Fragment>
            <H3>Simple TextField</H3>
            <TextField
                label={text('Label', 'Email', 'Default')}
                placeholder={text('Placeholder', 'input your email', 'Default')}
                required={boolean('Required', false, 'Default')}
                disabled={boolean('Disabled', false, 'Default')}
                name={text('Name', 'email', 'Default')}
                onChange={action('onchange')}

                variant={select('Variant', optionsVariant, 'filled', 'Style')}
                margin={select('Margin', optionsMargin, 'normal', 'Style')}
                fullWidth={boolean('FullWidth', true, 'Style')}

                multiline={boolean('Multiline', false, 'Multiline')}
                rows={number('Rows', 5, {}, 'Multiline')}
                rowsMax={number('RowsMax', 10, {}, 'Multiline')}

                select={boolean('Select', false, 'Select')}
            >{generateOptions(currencies)}</TextField>
        </Fragment>
    ));

storiesOf('Components.TextField', module)
    .addDecorator(withKnobs)
    .addWithJSX('Multiline', () => (
        <Fragment>
            <H3>Multiline TextField</H3>
            <TextField
                label={text('Label', 'Multiline', 'Default')}
                placeholder={text('Placeholder', 'type your multiline text', 'Default')}
                required={boolean('Required', false, 'Default')}
                disabled={boolean('Disabled', false, 'Default')}
                name={text('Name', 'email', 'Default')}
                onChange={action('onchange')}

                variant={select('Variant', optionsVariant, 'filled', 'Style')}
                margin={select('Margin', optionsMargin, 'normal', 'Style')}
                fullWidth={boolean('FullWidth', true, 'Style')}

                multiline={boolean('Multiline', true, 'Multiline')}
                rows={number('Rows', 5, {}, 'Multiline')}
                rowsMax={number('RowsMax', 10, {}, 'Multiline')}

                select={boolean('Select', false, 'Select')}
            >{generateOptions(currencies)}</TextField>
        </Fragment>
    ));

storiesOf('Components.TextField', module)
    .addDecorator(withKnobs)
    .addWithJSX('Number', () => (
        <Fragment>
            <H3>Still TextField but Number =)</H3>
            <TextField
                label={text('Label', 'Number', 'Default')}
                type="number"
                placeholder={text('Placeholder', 'input your number', 'Default')}
                required={boolean('Required', false, 'Default')}
                disabled={boolean('Disabled', false, 'Default')}
                name={text('Name', 'email', 'Default')}
                onChange={action('onchange')}

                variant={select('Variant', optionsVariant, 'filled', 'Style')}
                margin={select('Margin', optionsMargin, 'normal', 'Style')}
                fullWidth={boolean('FullWidth', true, 'Style')}

                select={boolean('Select', false, 'Select')}
            >{generateOptions(currencies)}</TextField>
        </Fragment>
    ));
