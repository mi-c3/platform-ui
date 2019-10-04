import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { UploadFileField as UFF } from 'index';
import H3 from 'storybook/components/atoms/H3';
import statefullInput from 'storybook/utils/hoc/statefullInput';

const UploadFileField = statefullInput(UFF);

storiesOf('Components|Uploaders', module)
    .addDecorator(withKnobs)
    .add('UploadFileField', () => {
        const onChange = action('onchange');
        const accept = text('Accepted Files', 'image/jpeg,image/png,image/bmp', 'Default');
        const label = text('Label', 'Upload you shapes', 'Default');
        const fileLabel = text('File Label', 'name', 'Default');
        return (
            <Fragment>
                <H3>UploadFileField</H3>
                <UploadFileField label={label} onChange={onChange} accept={accept} fileLabel={fileLabel} />
            </Fragment>
        );
    });
