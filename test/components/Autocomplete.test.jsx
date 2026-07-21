import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import { Autocomplete } from '../../src';

const options = [{ label: 'apple' }, { label: 'banana' }];

test('debounces suggest with the searchDelay prop', () => {
    jest.useFakeTimers();
    try {
        const suggest = jest.fn();
        render(<Autocomplete options={options} onChange={() => {}} suggest={suggest} searchDelay={1000} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ap' } });
        act(() => {
            jest.advanceTimersByTime(500);
        });
        expect(suggest).not.toHaveBeenCalled();
        act(() => {
            jest.advanceTimersByTime(600);
        });
        expect(suggest).toHaveBeenCalledTimes(1);
    } finally {
        jest.useRealTimers();
    }
});

test('debounces suggest with the 300ms default when searchDelay is not set', () => {
    jest.useFakeTimers();
    try {
        const suggest = jest.fn();
        render(<Autocomplete options={options} onChange={() => {}} suggest={suggest} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ap' } });
        act(() => {
            jest.advanceTimersByTime(350);
        });
        expect(suggest).toHaveBeenCalledTimes(1);
    } finally {
        jest.useRealTimers();
    }
});
