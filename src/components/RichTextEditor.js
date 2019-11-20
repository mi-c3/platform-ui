import React from 'react';
import PropTypes from 'prop-types';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TurndownService from 'turndown';

const RichTextEditor = ({ onChange, convertToMarkdown, ...restProps }) => {
    const handleOnChange = (event, editor) => {
        const turndownService = new TurndownService();
        let data = editor.getData();
        if (convertToMarkdown) data = turndownService.turndown(data);

        onChange(event, editor, data);
    };

    return <CKEditor editor={ClassicEditor} onChange={handleOnChange} {...restProps} />;
};

RichTextEditor.propTypes = {
    data: PropTypes.string,
    onInit: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    disabled: PropTypes.bool,
    convertToMarkdown: PropTypes.bool,
};

RichTextEditor.defaultProps = {
    data: '<p>Sample Data!!!</p>',
    onInit: (event, editor) => {
        event, editor;
    },
    onChange: (event, editor) => {
        event, editor;
    },
    onBlur: (event, editor) => {
        event, editor;
    },
    onFocus: (event, editor) => {
        event, editor;
    },
    disabled: false,
};

export default RichTextEditor;
