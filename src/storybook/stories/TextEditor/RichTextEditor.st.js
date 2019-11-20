import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import H3 from 'storybook/components/atoms/H3';
import RichTextEditor from 'components/RichTextEditor';

storiesOf('Components|RichTextEditor', module)
    .addDecorator(withKnobs)
    .add('Simple Rich-Text-Editor', () => {
        const props = {
            data: '<h1>Simple Rich-Text-Editor</h1>',
            onInit: (event, editor) => {
                action('onInit')({ editor });
            },
            onChange: (event, editor, data) => {
                action('onChange')({ event, editor, data });
            },
            onBlur: (event, editor) => {
                action('onBlur')({ event, editor });
            },
            onFocus: (event, editor) => {
                action('onFocus')({ event, editor });
            },
            disabled: false,
            convertToMarkdown: false,
        };
        return (
            <Fragment>
                <H3>Simple Rich Text Editor</H3>
                <RichTextEditor {...props} />
            </Fragment>
        );
    })
    .add('Disabled Rich-Text-Editor', () => {
        return (
            <Fragment>
                <H3>Disabled Rich Text Editor</H3>
                <RichTextEditor data={'<h1>Disabled Rich-Text-Editor</h1>'} disabled={true} />
            </Fragment>
        );
    })
    .add('Rich Text Editor onChange data converted to markdown', () => {
        const props = {
            data: '<h3>Rich Text Editor onChange data converted to markdown</h3>',
            onInit: (event, editor) => {
                action('onInit')({ editor });
            },
            onChange: (event, editor, data) => {
                action('onChange')({ event, editor, data });
            },
            onBlur: (event, editor) => {
                action('onBlur')({ event, editor });
            },
            onFocus: (event, editor) => {
                action('onFocus')({ event, editor });
            },
            disabled: false,
            convertToMarkdown: true,
        };
        return (
            <Fragment>
                <H3>Rich Text Editor onChange data converted to markdown</H3>
                <RichTextEditor {...props} />
            </Fragment>
        );
    });
