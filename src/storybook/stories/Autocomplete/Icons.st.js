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

storiesOf('Components.Autocomplete.Multiple', module)
    .addDecorator(withKnobs)
    .add('Icons', () => {
        const iconChipType = select('Icon chip type', forIconSelect.chipType, 'icon', 'Default');
        const SelectIconComponent = {
            icon: MdiSelectIconFull,
            letters: MdiSelectLetterFull,
        }[iconChipType];
        const disabled = boolean('Disabled', false, 'Default');
        const name = text('Name', 'countries', 'Default');
        const placeholder = text('Placeholder', 'Type A...', 'Default');
        const fullWidth = boolean('FullWidth', true, 'Style');
        const multiple = boolean('Multiple', false, 'Default');
        const label = text('Label', 'Icon name', 'Default');

        return (
            <Fragment>
                <H3>Multiple Select for Mdi Icons with Icons</H3>
                <SelectIconComponent
                    label={label}
                    disabled={disabled}
                    name={name}
                    placeholder={placeholder}
                    fullWidth={fullWidth}
                    multiple={multiple}
                    onChange={onChange}
                    valueField="value"
                />
            </Fragment>
        );
    });
