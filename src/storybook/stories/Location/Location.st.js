import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { onChange } from 'storybook/utils/action/action';

import H3 from 'storybook/components/atoms/H3';
import LocationForm from 'components/Location/LocationForm';
import statefullInput from 'storybook/utils/hoc/statefullInput';

const LocationFormFull = statefullInput(LocationForm);

storiesOf('Components.Location', module)
    .addDecorator(withKnobs)
    .add('LocationForm', () => {
        const name = text('Name', 'location', 'Default');
        const disabled = boolean('Disabled', false, 'Default');
        const withAutocomplete = boolean('With Autocomplete Mode', true, 'Default');

        const dark = boolean('Dark Theme', false, 'Default');
        const writeMode = boolean('Write Mode', false, 'Default');
        const streetViewControl = boolean('Street View', false, 'Default');
        const defaultZoom = number('Default Zoom', 16, { range: true, min: 1, max: 21 }, 'Default');
        return (
            <Fragment>
                <H3>Location Form</H3>
                <LocationFormFull
                    onChange={onChange}
                    name={name}
                    disabled={disabled}
                    withAutocomplete={withAutocomplete}
                    LocationProps={{ dark, writeMode, streetViewControl, defaultZoom }}
                />
            </Fragment>
        );
    });
