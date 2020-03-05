import React from 'react';
import { render } from '@testing-library/react';
import { Button } from '../../src';
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';
expect.extend({ toBeInTheDocument });

test('renders a title', () => {
    const { getByText } = render(<Button>Test button</Button>);
    const element = getByText(/test button/i);
    expect(element).toBeInTheDocument();
});
