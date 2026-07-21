import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { UploadFiles } from '../../src';

const dropData = (files) => ({
    dataTransfer: {
        files,
        items: files.map((file) => ({ kind: 'file', type: file.type, getAsFile: () => file })),
        types: ['Files'],
    },
});

const getDropzoneRoot = (container) => container.querySelector('input[type="file"]').parentElement;

test('emits all dropped files as an array when multiple is set', async () => {
    const onChange = jest.fn();
    const { container } = render(<UploadFiles name="attachments" label="Files" multiple onChange={onChange} />);
    const files = [
        new File(['a'], 'a.txt', { type: 'text/plain' }),
        new File(['b'], 'b.txt', { type: 'text/plain' }),
    ];
    fireEvent.drop(getDropzoneRoot(container), dropData(files));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const { target } = onChange.mock.calls[0][0];
    expect(target.name).toBe('attachments');
    expect(target.value).toHaveLength(2);
    expect(target.value.map((f) => f.name)).toEqual(['a.txt', 'b.txt']);
});

test('emits a single file by default', async () => {
    const onChange = jest.fn();
    const { container } = render(<UploadFiles name="attachment" label="File" onChange={onChange} />);
    const files = [
        new File(['a'], 'a.txt', { type: 'text/plain' }),
        new File(['b'], 'b.txt', { type: 'text/plain' }),
    ];
    fireEvent.drop(getDropzoneRoot(container), dropData(files));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const { target } = onChange.mock.calls[0][0];
    expect(target.name).toBe('attachment');
    expect(target.value).toBeInstanceOf(File);
    expect(target.value.name).toBe('a.txt');
});

test('clear button emits a null value', () => {
    const onChange = jest.fn();
    render(<UploadFiles name="attachment" label="File" value={{ name: 'a.txt' }} fileLabel="name" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Clear input'));
    expect(onChange).toHaveBeenCalledWith({ target: { name: 'attachment', value: null } });
});
