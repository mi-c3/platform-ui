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
const HELD = '2026-08-06T19:40:00.000Z';

class Probe extends V3ModalPickerBase {
    firstView = 'hours';

    render() {
        return (
            <div>
                <span data-testid="value">{String(this.pickerValue)}</span>
                <span data-testid="view">{String(this.view)}</span>
                <button data-testid="open" onClick={this.onOpen} />
                <button data-testid="select" onClick={() => this.onChange(SELECTED)} />
                <button data-testid="accept-bar" onClick={() => this.acceptDraft(this.pickerValue)} />
                <button data-testid="accepted" onClick={() => this.onAccept(SELECTED)} />
                <button data-testid="view-change" onClick={() => this.onViewChange('minutes')} />
                <button data-testid="close" onClick={this.onClose} />
            </div>
        );
    }
}

const renderProbe = (props) => {
    const onChange = jest.fn();
    render(<Probe name="when" value={HELD} onChange={onChange} {...props} />);
    return { onChange };
};
const shown = () => screen.getByTestId('value').textContent;

describe('V3ModalPickerBase', () => {
    test('a selection is held as a draft, not published', () => {
        const { onChange } = renderProbe();

        fireEvent.click(screen.getByTestId('select'));

        expect(onChange).not.toHaveBeenCalled();
        // Handed back down as the picker's value, which is the only way a controlled v8 picker
        // lights the selection up: it renders the views from that prop and keeps no draft itself.
        expect(shown()).toBe(SELECTED);
    });

    test('the action bar publishes the draft once, as a change event carrying name and type', () => {
        const { onChange } = renderProbe({ type: 'dateTime' });

        fireEvent.click(screen.getByTestId('select'));
        fireEvent.click(screen.getByTestId('accept-bar'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target).toEqual({ name: 'when', value: SELECTED, type: 'dateTime' });
    });

    test('the action bar publishes the untouched value when nothing was selected', () => {
        // v3 committed the date the dialog opened on, so a field that seeds "now" commits "now".
        const { onChange } = renderProbe();

        fireEvent.click(screen.getByTestId('accept-bar'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].target.value.toISOString()).toBe(new Date(HELD).toISOString());
    });

    test('an empty picker opens on "now", so OK with nothing selected still commits', () => {
        // v3 fell back to the current date when the value was null; v8 opens on nothing.
        const { onChange } = renderProbe({ value: null });

        fireEvent.click(screen.getByTestId('open'));
        fireEvent.click(screen.getByTestId('accept-bar'));

        expect(onChange).toHaveBeenCalledTimes(1);
        const published = onChange.mock.calls[0][0].target.value;
        expect(published).not.toBeNull();
        expect(Math.abs(published.valueOf() - Date.now())).toBeLessThan(5000);
    });

    test('the seeded "now" is a draft: Cancel leaves the empty value alone', () => {
        const { onChange } = renderProbe({ value: null });

        fireEvent.click(screen.getByTestId('open'));
        fireEvent.click(screen.getByTestId('close'));

        expect(onChange).not.toHaveBeenCalled();
        expect(shown()).toBe('null');
    });

    test('the fallback is moved inside minDate/maxDate rather than opening a forbidden view', () => {
        const MAX = '2020-01-31T00:00:00.000Z';
        const { onChange } = renderProbe({ value: null, maxDate: MAX });

        fireEvent.click(screen.getByTestId('open'));
        fireEvent.click(screen.getByTestId('accept-bar'));

        expect(onChange.mock.calls[0][0].target.value.toISOString()).toBe(new Date(MAX).toISOString());
    });

    test('a minDate in the future wins over "now" the same way', () => {
        const MIN = '2999-01-31T00:00:00.000Z';
        const { onChange } = renderProbe({ value: null, minDate: MIN });

        fireEvent.click(screen.getByTestId('open'));
        fireEvent.click(screen.getByTestId('accept-bar'));

        expect(onChange.mock.calls[0][0].target.value.toISOString()).toBe(new Date(MIN).toISOString());
    });

    test('bounds that "now" already satisfies leave it alone', () => {
        const { onChange } = renderProbe({ value: null, minDate: '1970-01-01', maxDate: '2999-01-01' });

        fireEvent.click(screen.getByTestId('open'));
        fireEvent.click(screen.getByTestId('accept-bar'));

        expect(Math.abs(onChange.mock.calls[0][0].target.value.valueOf() - Date.now())).toBeLessThan(5000);
    });

    test('a second open does not reseed a draft that is already being edited', () => {
        // MUI fires onOpen for every setOpen(true), without checking the picker was closed.
        const { onChange } = renderProbe({ value: null });

        fireEvent.click(screen.getByTestId('open'));
        fireEvent.click(screen.getByTestId('select'));
        fireEvent.click(screen.getByTestId('open'));

        expect(shown()).toBe(SELECTED);
        fireEvent.click(screen.getByTestId('accept-bar'));
        expect(onChange.mock.calls[0][0].target.value).toBe(SELECTED);
    });

    test('a picker opened on a value it already holds is not reseeded', () => {
        const { onChange } = renderProbe();

        fireEvent.click(screen.getByTestId('open'));
        fireEvent.click(screen.getByTestId('accept-bar'));

        expect(onChange.mock.calls[0][0].target.value.toISOString()).toBe(new Date(HELD).toISOString());
    });

    test('commitOn="change" does not seed: the caller stages its own opening value', () => {
        // DateTimePickerRange seeds both ends itself and restores them on Cancel.
        const onOpen = jest.fn();
        const { onChange } = renderProbe({ value: null, commitOn: 'change', onOpen });

        fireEvent.click(screen.getByTestId('open'));

        expect(onOpen).toHaveBeenCalledTimes(1);
        expect(onChange).not.toHaveBeenCalled();
        expect(shown()).toBe('null');
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

    test('tracks the view it is moved to, and starts on the picker\'s first one', () => {
        renderProbe();
        expect(screen.getByTestId('view').textContent).toBe('hours');

        fireEvent.click(screen.getByTestId('view-change'));

        expect(screen.getByTestId('view').textContent).toBe('minutes');
    });

    test('a caller driving the view wins over the tracked one', () => {
        renderProbe({ view: 'minutes' });

        expect(screen.getByTestId('view').textContent).toBe('minutes');
    });

    test('forwards the picker callbacks it wraps', () => {
        const onClose = jest.fn();
        const onAccept = jest.fn();
        const onViewChange = jest.fn();
        renderProbe({ onClose, onAccept, onViewChange });

        fireEvent.click(screen.getByTestId('accepted'));
        fireEvent.click(screen.getByTestId('view-change'));
        fireEvent.click(screen.getByTestId('close'));

        expect(onAccept).toHaveBeenCalledWith(SELECTED);
        expect(onViewChange).toHaveBeenCalledWith('minutes');
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
