import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { Dropzone, Typography } from 'index';
import H3 from 'stories/components/atoms/H3';
import DropzoneDialogWrapper from 'stories/components/DropzoneDialogWrapper';

storiesOf('Components.Uploads', module)
    .addDecorator(withKnobs)
    .add('Dropzone', () => {
        const props = {
            dropzoneText: text('Main text', 'Drag an image here', 'Default'),
            dropzoneTextHover: text('Hover text', 'YES HERE...', 'Default'),
            showPreviews: boolean('Shows previews', true, 'Default'),
            capture: boolean('Select only from camera', false, 'Default'),
            multiple: boolean('Multiple', false, 'Default'),
            showAlerts: boolean('Show alerts', true, 'Default'),
            filesLimit: number('Files limit', 3, {}, 'Default'),
            maxSize: number('Files size limit', 3000000, {}, 'Default'),
            onChange: action('onchange'),
            onDropRejected: action('onDropRejected'),
            imageOptions: {
                maxWidth: number('Max Width', 700, { max: 5000, min: 1, range: true, step: 1 }, 'Image Options'),
                maxHeight: number('Max Height', 400, { max: 3000, min: 1, range: true, step: 1 }, 'Image Options'),
                quality: number('quality', .8, { max: 1, min: 0, range: true, step: 0.1 }, 'Image Options'),
            },
        };
        return (
            <Fragment>
                <H3>Dropzone Area</H3>
                <Dropzone
                    {...props}
                    accept={text('Accepted Files', 'image/jpeg,image/png,image/bmp', 'Default')}
                />
            </Fragment>
        );
    });

storiesOf('Components.Uploads', module)
    .addDecorator(withKnobs)
    .add('Dropzone:onDrag', () => {
        const props = {
            dropzoneTextHover: text('Hover text', 'Drag an image here...', 'Default'),
            dropzoneTextRejected: text('Rejected text', 'You cant drag this file...', 'Default'),
            showPreviews: boolean('Shows previews', false, 'Default'),
            capture: boolean('Select only from camera', false, 'Default'),
            multiple: boolean('Multiple', false, 'Default'),
            showAlerts: boolean('Show alerts', false, 'Default'),
            filesLimit: number('Files limit', 1, {}, 'Default'),
            maxSize: number('Files size limit', 3000000, {}, 'Default'),
            onChange: action('onchange'),
            onDropRejected: action('onDropRejected'),
            imageOptions: {
                maxWidth: number('Max Width', 700, { max: 5000, min: 1, range: true, step: 1 }, 'Image Options'),
                maxHeight: number('Max Height', 400, { max: 3000, min: 1, range: true, step: 1 }, 'Image Options'),
                quality: number('quality', .8, { max: 1, min: 0, range: true, step: 0.1 }, 'Image Options'),
            },
        };
        return (
            <Fragment>
                <H3>Dropzone:onDrag</H3>
                <Dropzone
                    {...props}
                    accept={text('Accepted Files', 'image/jpeg,image/png,image/bmp', 'Default')}
                >
                    <Typography variant="h1">Drag some file inside this text area.</Typography>
                </Dropzone>
            </Fragment>
        );
    });

storiesOf('Components.Uploads', module)
    .addDecorator(withKnobs)
    .add('DropzoneDialog', () => {
        const props = {
            dropzoneText: text('Main text', 'Drag an image here', 'Default'),
            dropzoneTextHover: text('Hover text', 'YES HERE...', 'Default'),
            showPreviews: boolean('Shows previews', true, 'Default'),
            capture: boolean('Select only from camera', false, 'Default'),
            multiple: boolean('Multiple', false, 'Default'),
            showAlerts: boolean('Show alerts', true, 'Default'),
            filesLimit: number('Files limit', 3, {}, 'Default'),
            maxSize: number('Files size limit', 3000000, {}, 'Default'),
            onChange: action('onchange'),
            onDropRejected: action('onDropRejected'),
            imageOptions: {
                maxWidth: number('Max Width', 700, { max: 5000, min: 1, range: true, step: 1 }, 'Image Options'),
                maxHeight: number('Max Height', 400, { max: 3000, min: 1, range: true, step: 1 }, 'Image Options'),
                quality: number('quality', .8, { max: 1, min: 0, range: true, step: 0.1 }, 'Image Options'),
            },
        };
        return (
            <Fragment>
                <H3>Dropzone Dialog</H3>
                <DropzoneDialogWrapper
                    {...props}
                    title={text('Modal title', 'Upload File', 'Default')}
                    onSave={action('onSave')}
                    accept={text('Accepted Files', 'image/*,application/*', 'Default')}
                />
            </Fragment>
        );
    });
