import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import V3ModalPickerBase from '../../src/utils/pickers/V3ModalPickerBase';

/*
 * The commit semantics every modal picker inherits, driven directly. The two date pickers exercise
 * the same handlers through the real MUI dialog in test/components/pickers.test.jsx; the clock cannot
 * be driven from jsdom (MUI derives the selection from pointer geometry against the face), so
 * TimePicker's half of the contract is pinned here.
 */
const SELECTED = '2026-08-15T09:00:00.000Z';

class Probe extends V3ModalPickerBase {
    firstView = 'hours';

    render() {
        return (
            <div>
                <span data-testid="value">{String(this.pickerValue)}</span>
                <span data-testid="open">{String(this.open)}</span>
                <span data-testid="view">{String(this.view)}</span>
                <button data-testid="open-it" onClick={this.onOpen} />
                <button data-testid="select" onClick={() => this.onChange(SELECTED)} />
                <button data-testid="accept" onClick={() => this.onAccept(SELECTED)} />
                <button data-testid="close" onClick={this.onClose} />
            </div>
        );
    }
}

const renderProbe = (props) => {
    const onChange = jest.fn();
    render(<Probe name="when" value="2026-08-06T19:40:00.000Z" onChange={onChange} {...props} />);
    return { onChange };
};
const shown = () => screen.getByTestId('value').textContent;

describe('V3ModalPickerBase', () => {
    test('a selection is held as a draft, not published', () => {
        const { onChange } = renderProbe();
        const before = shown();

        fireEvent.click(screen.getByTestId('select'));

        expect(onChange).not.toHaveBeenCalled();
        // Handed back down as the picker's value, which is the only way a controlled v8 picker
        // lights the selection up: it renders the views from that prop and keeps no draft itself.
        expect(shown()).not.toBe(before);
        expect(shown()).toBe(SELECTED);
    });

    test('accepting publishes it once, as a change event carrying name and type', () => {
        const { onChange } = renderProbe({ type: 'dateTime' });

        fireEvent.click(screen.getByTestId('select'));
        fireEvent.click(screen.getByTestId('accept'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target).toEqual({ name: 'when', value: SELECTED, type: 'dateTime' });
    });

    test('closing drops the draft, which is all Cancel has to do', () => {
        const { onChange } = renderProbe();
        const before = shown();

        fireEvent.click(screen.getByTestId('select'));
        fireEvent.click(screen.getByTestId('close'));

        expect(onChange).not.toHaveBeenCalled();
        // Nothing was published, so the value the consumer holds never moved.
        expect(shown()).toBe(before);
    });

    test('commitOn="change" publishes every selection instead', () => {
        const { onChange } = renderProbe({ commitOn: 'change' });

        fireEvent.click(screen.getByTestId('select'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target.value).toBe(SELECTED);
    });

    test('keyboardInput publishes every selection too', () => {
        const { onChange } = renderProbe({ keyboardInput: true });

        fireEvent.click(screen.getByTestId('select'));

        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('opening tracks the open state and the first view', () => {
        renderProbe();
        expect(screen.getByTestId('open').textContent).toBe('false');

        fireEvent.click(screen.getByTestId('open-it'));

        expect(screen.getByTestId('open').textContent).toBe('true');
        expect(screen.getByTestId('view').textContent).toBe('hours');
    });

    test('a disabled or read-only picker does not open', () => {
        renderProbe({ disabled: true });
        fireEvent.click(screen.getByTestId('open-it'));
        expect(screen.getByTestId('open').textContent).toBe('false');

        screen.getByTestId('open').remove();
        render(<Probe name="when" value={null} onChange={() => {}} readOnly />);
        fireEvent.click(screen.getAllByTestId('open-it')[1]);
        expect(screen.getByTestId('open').textContent).toBe('false');
    });

    test('a caller driving open and view wins over the tracked state', () => {
        renderProbe({ open: true, view: 'minutes' });

        expect(screen.getByTestId('open').textContent).toBe('true');
        expect(screen.getByTestId('view').textContent).toBe('minutes');
    });

    test('forwards the picker callbacks it wraps', () => {
        const onOpen = jest.fn();
        const onClose = jest.fn();
        const onAccept = jest.fn();
        renderProbe({ onOpen, onClose, onAccept });

        fireEvent.click(screen.getByTestId('open-it'));
        fireEvent.click(screen.getByTestId('accept'));
        fireEvent.click(screen.getByTestId('close'));

        expect(onOpen).toHaveBeenCalledTimes(1);
        expect(onAccept).toHaveBeenCalledWith(SELECTED);
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
