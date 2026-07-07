import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { UploadFileField } from '../../src';

test('shows the upload adornment when there is no value', () => {
    render(<UploadFileField name="file" label="File" onChange={() => {}} />);
    expect(screen.getByLabelText('Upload')).toBeInTheDocument();
});

test('clear button emits a null value', () => {
    const onChange = jest.fn();
    render(<UploadFileField name="file" label="File" value={{ name: 'a.txt' }} fileLabel="name" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Clear input'));
    expect(onChange).toHaveBeenCalledWith({ target: { name: 'file', value: null } });
});
