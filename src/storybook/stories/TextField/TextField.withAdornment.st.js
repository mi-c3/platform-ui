import React, { Fragment } from 'react';
import memoize from 'memoize-one';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import statefullInput from 'storybook/utils/hoc/statefullInput';
import { currencies } from 'storybook/mock/currencies';
import { TextField as TF, MenuItem, InputAdornment, MdiIcon } from 'index';
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
};

storiesOf('Components|TextField', module)
    .addDecorator(withKnobs)
    .add('Text with Adornment', () => {
        const label = text('Label', 'Textfield', 'Default');
        const placeholder = text('Placeholder', 'type your text', 'Default');
        const required = boolean('Required', false, 'Default');
        const disabled = boolean('Disabled', false, 'Default');
        const name = text('Name', 'email', 'Default');
        const onChange = action('onchange');
        const variant = select('Variant', optionsVariant, 'filled', 'Style');
        const fullWidth = boolean('FullWidth', true, 'Style');
        const multiline = boolean('Multiline', false, 'Multiline');
        const rows = number('Rows', 5, {}, 'Multiline');
        const rowsMax = number('RowsMax', 10, {}, 'Multiline');
        const selectList = boolean('Select', false, 'Select');

        return (
            <Fragment>
                <H3>TextField with left adornment</H3>
                <TextField
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    name={name}
                    onChange={onChange}
                    variant={variant}
                    fullWidth={fullWidth}
                    multiline={multiline}
                    rows={rows}
                    rowsMax={rowsMax}
                    select={selectList}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdiIcon name="yin-yang" size={20} />
                            </InputAdornment>
                        ),
                    }}
                >
                    {generateOptions(currencies)}
                </TextField>
            </Fragment>
        );
    });
