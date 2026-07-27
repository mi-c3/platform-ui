import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Link } from '../../src';

test('renders a plain MUI link when no `to` is given', () => {
    const { getByText } = render(<Link href="https://mui.com/">MUI</Link>);
    expect(getByText('MUI')).toHaveAttribute('href', 'https://mui.com/');
});

test('renders through the router link when `to` is given', () => {
    const { getByText } = render(
        <MemoryRouter>
            <Link to="/about">About</Link>
        </MemoryRouter>
    );
    expect(getByText('About')).toHaveAttribute('href', '/about');
});
