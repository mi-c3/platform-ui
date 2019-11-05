import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';

import { onChange } from 'storybook/utils/action/action';
import { MdiSelectIcon, MdiSelectLetter } from 'storybook/components/MdiIconSelect';
import { forIconSelect } from 'storybook/constants/propsVariation';
import statefullInput from 'storybook/utils/hoc/statefullInput';
import H3 from 'storybook/components/atoms/H3';

const MdiSelectIconFull = statefullInput(MdiSelectIcon);
const MdiSelectLetterFull = statefullInput(MdiSelectLetter);

storiesOf('Components|Autocomplete.Multiple', module)
    .addDecorator(withKnobs)
    .add('Letters', () => {
        const iconChipType = select('Icon chip type', forIconSelect.chipType, 'letters', 'Default');
        const SelectIconComponent = {
            icon: MdiSelectIconFull,
            letters: MdiSelectLetterFull,
        }[iconChipType];
        const disabled = boolean('Disabled', false, 'Default');
        const name = text('Name', 'countries', 'Default');
        const placeholder = text('Placeholder', 'Type A...', 'Default');
        const helperText = text('Helper text', 'Any helper text...', 'Default');
        const fullWidth = boolean('FullWidth', true, 'Style');
        const multiple = boolean('Multiple', true, 'Default');
        const error = boolean('Error', false, 'Default');
        return (
            <Fragment>
                <H3>Multiple Select with letters of Icon name</H3>
                <SelectIconComponent
                    label={'Icon name'}
                    disabled={disabled}
                    name={name}
                    placeholder={placeholder}
                    fullWidth={fullWidth}
                    multiple={multiple}
                    onChange={onChange}
                    error={error}
                    helperText={helperText}
                    valueField="value"
                />
            </Fragment>
        );
    });
