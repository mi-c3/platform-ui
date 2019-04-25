import React, { Fragment } from 'react';
import memoize from 'memoize-one';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import statefullInput from 'storybook/utils/hoc/statefullInput';
import { currencies } from 'storybook/mock/currencies';
import { TextField as TF, MenuItem } from 'index';
import H3 from 'storybook/components/atoms/H3';

const TextField = statefullInput(TF);

const generateOptions = memoize((currencies) =>
    currencies.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
            {label}
        </MenuItem>
    ))
);

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

storiesOf('Components|TextField', module)
    .addDecorator(withKnobs)
    .add('Multiline', () => {
        const label = text('Label', 'Multiline', 'Default');
        const placeholder = text('Placeholder', 'type your multiline text', 'Default');
        const required = boolean('Required', false, 'Default');
        const disabled = boolean('Disabled', false, 'Default');
        const name = text('Name', 'email', 'Default');
        const onChange = action('onchange');
        const variant = select('Variant', optionsVariant, 'filled', 'Style');
        const margin = select('Margin', optionsMargin, 'normal', 'Style');
        const fullWidth = boolean('FullWidth', true, 'Style');
        const multiline = boolean('Multiline', true, 'Multiline');
        const rows = number('Rows', 5, {}, 'Multiline');
        const rowsMax = number('RowsMax', 10, {}, 'Multiline');
        const selectList = boolean('Select', false, 'Select');

        return (
            <Fragment>
                <H3>Multiline TextField</H3>
                <TextField
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    name={name}
                    onChange={onChange}
                    variant={variant}
                    margin={margin}
                    fullWidth={fullWidth}
                    multiline={multiline}
                    rows={rows}
                    rowsMax={rowsMax}
                    select={selectList}
                >
                    {generateOptions(currencies)}
                </TextField>
            </Fragment>
        );
    });
