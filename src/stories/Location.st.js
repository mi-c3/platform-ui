import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { onChange } from 'stories/utils/action/action';

import H3 from 'stories/components/atoms/H3';
import LocationForm from 'components/Location/LocationForm';
import LocationSwitch from 'components/Location/LocationSwitch';
import statefullInput from 'stories/utils/hoc/statefullInput';

const LocationFormFull = statefullInput(LocationForm);
const LocationSwitchFull = statefullInput(LocationSwitch);

storiesOf('Components.Location', module)
    .addDecorator(withKnobs)
    .addWithJSX('LocationForm', () => {
        const defaultProps = {
            name: text('Name', 'location', 'Default'),
            onChange,
            disabled: boolean('Disabled', false, 'Default'),
            withAutocomplete: boolean('With Autocomplete Mode', true, 'Default'),
            LocationProps: {
                dark: boolean('Dark Theme', false, 'Default'),
                writeMode: boolean('Write Mode', false, 'Default'),
                streetViewControl: boolean('Street View', false, 'Default'),
                defaultZoom: number('Default Zoom', 16, { range: true, min:1, max: 21 }, 'Default'),
            }
        };
        return (
            <Fragment>
                <H3>Location Form</H3>
                <LocationFormFull {...defaultProps}/>
            </Fragment>
        );
    });

storiesOf('Components.Location', module)
    .addDecorator(withKnobs)
    .addWithJSX('LocationSwitch', () => {
        const defaultProps = {
            label: text('Label', 'Geotaging', 'Default'),
            name: text('Name', 'location', 'Default'),
            onChange,
            disabled: boolean('Disabled', true, 'Default'),
            withAutocomplete: boolean('With Autocomplete Mode', true, 'Default'),
            LocationProps: {
                dark: boolean('Dark Theme', false, 'Default'),
                writeMode: boolean('Write Mode', false, 'Default'),
                streetViewControl: boolean('Street View', false, 'Default'),
                defaultZoom: number('Default Zoom', 16, { range: true, min:1, max: 21 }, 'Default'),
            }

        };
        return (
            <Fragment>
                <H3>Switch location</H3>
                <LocationSwitchFull {...defaultProps}/>
            </Fragment>
        );
    });
