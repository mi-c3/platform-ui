import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import { onChange } from 'storybook/utils/action/action';
import { getUsers } from 'storybook/mock/user';
import { getCities } from 'storybook/mock/city';
import { getStuff } from 'storybook/mock/stuff';
import statefullInput from 'storybook/utils/hoc/statefullInput';
import AL from 'components/AutocompleteLazy';
import H3 from 'storybook/components/atoms/H3';

const AutocompleteLazy = statefullInput(AL);

storiesOf('Components|Autocomplete', module)
    .addDecorator(withKnobs)
    .add('Typeahead', () => {
        const disabled = boolean('Disabled', false, 'Default');
        const name = text('Name', 'countries', 'Default');
        const placeholder = text('Placeholder', 'Type A...', 'Default');
        const fullWidth = boolean('FullWidth', true, 'Style');
        const multiple = boolean('Multiple', false, 'Default');
        const labelUser = text('Label', 'User', 'Default');
        const labelCittiesDB = text('Label', 'Cities DB', 'Default');
        const labelStuff = text('Label', 'Stuff (Big Data)', 'Default');
        return (
            <Fragment>
                <H3>Lazy Typeahead Autocomplete with imitation of server side rendering</H3>
                <AutocompleteLazy
                    label={labelUser}
                    disabled={disabled}
                    name={name}
                    placeholder={placeholder}
                    fullWidth={fullWidth}
                    multiple={multiple}
                    onChange={onChange}
                    fetchData={getUsers}
                    optionTemplate={({ name, id }) => ({ label: `${name} (${id})` })}
                />
                <AutocompleteLazy
                    label={labelCittiesDB}
                    disabled={disabled}
                    name={name}
                    placeholder={placeholder}
                    fullWidth={fullWidth}
                    multiple={multiple}
                    onChange={onChange}
                    fetchData={getCities}
                    optionTemplate={({ name, country }) => ({ label: `${name} (${country})` })}
                />
                <AutocompleteLazy
                    label={labelStuff}
                    disabled={disabled}
                    name={name}
                    placeholder={placeholder}
                    fullWidth={fullWidth}
                    multiple={multiple}
                    onChange={onChange}
                    fetchData={getStuff}
                    valueId={text('valueId', 'id', 'Default')}
                    optionTemplate={({ name, id }) => ({ label: `${name} (${id})` })}
                />
            </Fragment>
        );
    });
