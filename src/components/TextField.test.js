import React from 'react';
import { render } from '@testing-library/react';
import TextField from './TextField';

test('lable', () => {
    const { getByText } = render(<TextField name="ok" label="My Label" />);
    const element = getByText(/my label/i);
    expect(element).toBeInTheDocument();
});
