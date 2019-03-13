import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';

import { onChange } from 'stories/utils/action/action';
import { MdiSelectIcon, MdiSelectLetter } from 'stories/components/MdiIconSelect';
import { countries } from 'stories/mock/countries';
import { forIconSelect } from 'stories/constants/propsVariation';
import { getUsers } from 'stories/mock/user';
import { getCities } from 'stories/mock/city';
import { getStuff } from 'stories/mock/stuff';
import statefullInput from 'stories/utils/hoc/statefullInput';
import AL from 'components/AutocompleteLazy';
import AUCO from 'components/Autocomplete';
import H3 from 'stories/components/atoms/H3';

const Autocomplete = statefullInput(AUCO);
const AutocompleteLazy = statefullInput(AL);
const MdiSelectIconFull = statefullInput(MdiSelectIcon);
const MdiSelectLetterFull = statefullInput(MdiSelectLetter);

storiesOf('Components.Autocomplete', module)
    .addDecorator(withKnobs)
    .addWithJSX('Dropdown', () => (
        <Fragment>
            <H3>Simple Autocomplete with static data</H3>
            <Autocomplete
                label={text('Label', 'Countries', 'Default')}
                disabled={boolean('Disabled', false, 'Default')}
                name={text('Name', 'countries', 'Default')}
                placeholder={text('Placeholder', 'Type A...', 'Default')}
                fullWidth={boolean('FullWidth', true, 'Style')}
                multiple={boolean('Multiple', false, 'Default')}
                onChange={onChange}
                options={countries}
                valueField="value"
            />
        </Fragment>
    ));

storiesOf('Components.Autocomplete', module)
    .addDecorator(withKnobs)
    .addWithJSX('MdiIconSelect', () => {
        const iconChipType = select('Icon chip type', forIconSelect.chipType, 'icon', 'Default');
        const SelectIconComponent = {
            'icon': MdiSelectIconFull,
            'letters': MdiSelectLetterFull,
        }[iconChipType];
        return (
            <Fragment>
                <H3>Select for Mdi Icons</H3>
                <SelectIconComponent
                    label={'Icon name'}
                    disabled={boolean('Disabled', false, 'Default')}
                    name={text('Name', 'icon', 'Default')}
                    placeholder={text('Placeholder', 'Type A...', 'Default')}
                    fullWidth={boolean('FullWidth', true, 'Style')}
                    multiple={boolean('Multiple', false, 'Default')}
                    onChange={onChange}
                    valueField="value"
                />
            </Fragment>
        );
    });

storiesOf('Components.Autocomplete', module)
    .addDecorator(withKnobs)
    .addWithJSX('Typeahead', () => (
        <Fragment>
            <H3>Lazy Typeahead Autocomplete with imitation of server side rendering</H3>
            <AutocompleteLazy
                label={text('Label', 'User', 'Default')}
                disabled={boolean('Disabled', false, 'Default')}
                name={text('Name', 'user', 'Default')}
                placeholder={text('Placeholder', 'Type D...', 'Default')}
                fullWidth={boolean('FullWidth', true, 'Style')}
                multiple={boolean('Multiple', false, 'Default')}
                onChange={onChange}
                fetchData={getUsers}
                optionTemplate={({ name, id }) => ({ label: `${name} (${id})` })}
            />
            <AutocompleteLazy
                label={text('Label', 'Cities DB', 'Default')}
                disabled={boolean('Disabled', false, 'Default')}
                name={text('Name', 'city', 'Default')}
                placeholder={text('Placeholder', 'Search a city...', 'Default')}
                fullWidth={boolean('FullWidth', true, 'Style')}
                multiple={boolean('Multiple', false, 'Default')}
                onChange={onChange}
                fetchData={getCities}
                optionTemplate={({ name, country }) => ({ label: `${name} (${country})` })}
            />
            <AutocompleteLazy
                label={text('Label', 'Stuff (Big Data)', 'Default')}
                disabled={boolean('Disabled', false, 'Default')}
                name={text('Name', 'stuff', 'Default')}
                placeholder={text('Placeholder', 'Search a guy...', 'Default')}
                fullWidth={boolean('FullWidth', true, 'Style')}
                multiple={boolean('Multiple', false, 'Default')}
                onChange={onChange}
                fetchData={getStuff}
                valueId={text('valueId', 'id', 'Default')}
                optionTemplate={({ name, id }) => ({ label: `${name} (${id})` })}
            />
        </Fragment>
    ));

storiesOf('Components.Autocomplete.Multiple', module)
    .addDecorator(withKnobs)
    .addWithJSX('Icons', () => {
        const iconChipType = select('Icon chip type', forIconSelect.chipType, 'icon', 'Default');
        const SelectIconComponent = {
            'icon': MdiSelectIconFull,
            'letters': MdiSelectLetterFull,
        }[iconChipType];
        return (
            <Fragment>
                <H3>Multiple Select for Mdi Icons with Icons</H3>
                <SelectIconComponent
                    label={'Icon name'}
                    disabled={boolean('Disabled', false, 'Default')}
                    name={text('Name', 'icon', 'Default')}
                    placeholder={text('Placeholder', 'Type A...', 'Default')}
                    fullWidth={boolean('FullWidth', true, 'Style')}
                    multiple={boolean('Multiple', true, 'Default')}
                    onChange={onChange}
                    valueField="value"
                />
            </Fragment>
        );
    });
storiesOf('Components.Autocomplete.Multiple', module)
    .addDecorator(withKnobs)
    .addWithJSX('Letters', () => {
        const iconChipType = select('Icon chip type', forIconSelect.chipType, 'letters', 'Default');
        const SelectIconComponent = {
            'icon': MdiSelectIconFull,
            'letters': MdiSelectLetterFull,
        }[iconChipType];
        return (
            <Fragment>
                <H3>Multiple Select with letters of Icon name</H3>
                <SelectIconComponent
                    label={'Icon name'}
                    disabled={boolean('Disabled', false, 'Default')}
                    name={text('Name', 'icon', 'Default')}
                    placeholder={text('Placeholder', 'Type A...', 'Default')}
                    fullWidth={boolean('FullWidth', true, 'Style')}
                    multiple={boolean('Multiple', true, 'Default')}
                    onChange={onChange}
                    valueField="value"
                />
            </Fragment>
        );
    });
