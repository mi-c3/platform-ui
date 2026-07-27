import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Button } from '../../src';

test('renders a title', () => {
    const { getByText } = render(<Button>Test button</Button>);
    const element = getByText(/test button/i);
    expect(element).toBeInTheDocument();
});

// `to` routes through the platform-ui Link, so Button is the second consumer of react-router.
test('renders through the router when `to` is given', () => {
    const { getByText } = render(
        <MemoryRouter>
            <Button to="/settings">Settings</Button>
        </MemoryRouter>
    );
    expect(getByText('Settings').closest('a')).toHaveAttribute('href', '/settings');
});
