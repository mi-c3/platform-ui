import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { AvatarEditor } from '../../src';

jest.mock('react-avatar-editor', () => {
    const MockEditor = () => <div data-testid="mock-editor" />;
    return MockEditor;
});

const dropData = (files) => ({
    dataTransfer: {
        files,
        items: files.map((file) => ({ kind: 'file', type: file.type, getAsFile: () => file })),
        types: ['Files'],
    },
});

const openEditor = async (container) => {
    const root = container.querySelector('input[type="file"]').parentElement;
    fireEvent.drop(root, dropData([new File(['x'], 'x.png', { type: 'image/png' })]));
    await waitFor(() => expect(screen.getByTestId('mock-editor')).toBeInTheDocument());
};

test('shows rotate controls by default', async () => {
    const { container } = render(<AvatarEditor initials="AB" />);
    await openEditor(container);
    expect(screen.getByText('Rotate:')).toBeInTheDocument();
});

test('EditorProps.disableRotate hides the rotate controls', async () => {
    const { container } = render(<AvatarEditor initials="AB" EditorProps={{ disableRotate: true }} />);
    await openEditor(container);
    expect(screen.queryByText('Rotate:')).not.toBeInTheDocument();
});

test('legacy EditorProps.diabelRotate still hides the rotate controls', async () => {
    const { container } = render(<AvatarEditor initials="AB" EditorProps={{ diabelRotate: true }} />);
    await openEditor(container);
    expect(screen.queryByText('Rotate:')).not.toBeInTheDocument();
});
