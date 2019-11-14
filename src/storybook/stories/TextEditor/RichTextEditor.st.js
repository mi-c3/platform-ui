import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TurndownService from 'turndown';

import H3 from 'storybook/components/atoms/H3';

storiesOf('Components|TextEditor', module)
    .addDecorator(withKnobs)
    .add('Simple Rich-Text-Editor', () => {
        return (
            <Fragment>
                <H3>Simple Rich Text Editor</H3>
                <CKEditor
                    editor={ClassicEditor}
                    data={'Simple Rich-Text-Editor'}
                    onInit={(editor) => {
                        action('onInit')({ editor });
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        action('onChange')({ event, editor, data });
                    }}
                    onBlur={(event, editor) => {
                        action('onBlur')({ event, editor });
                    }}
                    onFocus={(event, editor) => {
                        action('onFocus')({ event, editor });
                    }}
                />
            </Fragment>
        );
    })
    .add('Rich-Text-Editor onChange data converted to markdown', () => {
        const handleOnChange = (e, editor) => {
            const turndownService = new TurndownService();
            const data = editor.getData();
            action('onchange')({ data: turndownService.turndown(data) });
        };
        return (
            <Fragment>
                <H3>Rich-Text-Editor onChange data converted to markdown</H3>
                <CKEditor
                    editor={ClassicEditor}
                    data={'Rich-Text-Editor'}
                    onInit={(editor) => {
                        action('onInit')({ editor });
                    }}
                    onChange={handleOnChange}
                    onBlur={(event, editor) => {
                        action('onBlur')({ event, editor });
                    }}
                    onFocus={(event, editor) => {
                        action('onFocus')({ event, editor });
                    }}
                />
            </Fragment>
        );
    });
