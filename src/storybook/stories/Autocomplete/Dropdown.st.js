import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import { onChange } from 'storybook/utils/action/action';
import { countries } from 'storybook/mock/countries';
import statefullInput from 'storybook/utils/hoc/statefullInput';
import AUCO from 'components/Autocomplete';
import H3 from 'storybook/components/atoms/H3';

const Autocomplete = statefullInput(AUCO);

storiesOf('Components|Autocomplete', module)
    .addDecorator(withKnobs)
    .add('Dropdown', () => {
        const label = text('Label', 'Countries', 'Default');
        const disabled = boolean('Disabled', false, 'Default');
        const name = text('Name', 'countries', 'Default');
        const placeholder = text('Placeholder', 'Type A...', 'Default');
        const fullWidth = boolean('FullWidth', true, 'Style');
        const multiple = boolean('Multiple', false, 'Default');
        return (
            <Fragment>
                <H3>Simple Autocomplete with static data</H3>
                <Autocomplete
                    label={label}
                    disabled={disabled}
                    name={name}
                    placeholder={placeholder}
                    fullWidth={fullWidth}
                    multiple={multiple}
                    onChange={onChange}
                    options={countries}
                    valueField="value"
                />
            </Fragment>
        );
    });
