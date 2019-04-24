import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { Dropzone } from 'index';
import H3 from 'storybook/components/atoms/H3';

storiesOf('Components.Uploaders', module)
    .addDecorator(withKnobs)
    .add('Dropzone', () => {
        const dropzoneText = text('Main text', 'Drag an image here', 'Default');
        const dropzoneTextHover = text('Hover text', 'YES HERE...', 'Default');
        const showPreviews = boolean('Shows previews', true, 'Default');
        const capture = boolean('Select only from camera', false, 'Default');
        const multiple = boolean('Multiple', false, 'Default');
        const showAlerts = boolean('Show alerts', true, 'Default');
        const filesLimit = number('Files limit', 3, {}, 'Default');
        const maxSize = number('Files size limit', 3000000, {}, 'Default');
        const onChange = action('onchange');
        const onDropRejected = action('onDropRejected');
        const imageOptions = {
            maxWidth: number('Max Width', 700, { max: 5000, min: 1, range: true, step: 1 }, 'Image Options'),
            maxHeight: number('Max Height', 400, { max: 3000, min: 1, range: true, step: 1 }, 'Image Options'),
            quality: number('quality', 0.8, { max: 1, min: 0, range: true, step: 0.1 }, 'Image Options'),
        };
        const accept = text('Accepted Files', 'image/jpeg,image/png,image/bmp', 'Default');
        return (
            <Fragment>
                <H3>Dropzone Area</H3>
                <Dropzone
                    dropzoneText={dropzoneText}
                    dropzoneTextHover={dropzoneTextHover}
                    showPreviews={showPreviews}
                    capture={capture}
                    multiple={multiple}
                    showAlerts={showAlerts}
                    filesLimit={filesLimit}
                    maxSize={maxSize}
                    onChange={onChange}
                    onDropRejected={onDropRejected}
                    imageOptions={imageOptions}
                    accept={accept}
                />
            </Fragment>
        );
    });
