import React from 'react';
import { render, cleanup, waitForElement, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Button from '../../components/Button';

afterEach(cleanup);

it('renders button', async () => {
    const { getByText, getByTestId, container } = render(
        <Button data-testid="btn-primary" variant={'contained'} color={'primary'} size={'medium'}>
            Click Me!
        </Button>
    );
    const btnId = getByTestId('btn-primary');

    await waitForElement(() => getByText('Click Me!'));
    expect(btnId).toHaveTextContent('Click Me!');
    expect(btnId).toHaveClass('MuiButton-containedPrimary-14');
    expect(container.firstChild).toMatchSnapshot();
});

it('calls "onClick" prop on button click', async () => {
    const onClick = jest.fn();
    const { getByText, container } = render(<Button onClick={onClick}>Click Me!</Button>);

    fireEvent.click(getByText('Click Me!'));
    expect(onClick).toHaveBeenCalled();
    expect(container.firstChild).toMatchSnapshot();
});

it('checks button attribute', async () => {
    const { getByTestId, container } = render(
        <Button data-testid="btn-secondary" variant={'contained'} color={'secondary'} disabled={true}>
            Click Me!
        </Button>
    );

    expect(getByTestId('btn-secondary')).toHaveAttribute('disabled');
    expect(container.firstChild).toMatchSnapshot();
});
