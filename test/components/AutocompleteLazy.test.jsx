import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

import AutocompleteLazy from '../../src/components/AutocompleteLazy';

// jsdom geometry shim (virtualized listbox) — same as AutocompleteNext.test.jsx
const VIEWPORT = 400;
const heightOf = el => Number(el.dataset?.vh ?? VIEWPORT);
class ResizeObserverStub {
    constructor(callback) { this.callback = callback; }
    observe(element) {
        const borderBoxSize = [{ inlineSize: element.clientWidth, blockSize: element.clientHeight }];
        this.callback([{ target: element, borderBoxSize, contentRect: element.getBoundingClientRect() }], this);
    }
    unobserve() {}
    disconnect() {}
}
const originals = {};
beforeAll(() => {
    originals.ResizeObserver = global.ResizeObserver;
    originals.getBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    global.ResizeObserver = ResizeObserverStub;
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get() { return heightOf(this); } });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 400 });
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get: () => 1e6 });
    HTMLElement.prototype.getBoundingClientRect = function () {
        const height = heightOf(this);
        return { width: 400, height, top: 0, left: 0, right: 400, bottom: height, x: 0, y: 0, toJSON: () => {} };
    };
});
afterAll(() => {
    global.ResizeObserver = originals.ResizeObserver;
    delete HTMLElement.prototype.clientHeight;
    delete HTMLElement.prototype.clientWidth;
    delete HTMLElement.prototype.scrollHeight;
    HTMLElement.prototype.getBoundingClientRect = originals.getBoundingClientRect;
});

const PAGE = [{ label: 'London' }, { label: 'Lisbon' }];

test('fetchData drives the open-time page load and selection (Lazy over AutocompleteNext)', async () => {
    const fetchData = jest.fn().mockResolvedValue(PAGE);
    const onChange = jest.fn();
    render(<AutocompleteLazy name="loc" onChange={onChange} fetchData={fetchData} />);
    const input = screen.getByRole('combobox');
    fireEvent.mouseDown(input);
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // the open-time suggest('') goes through fetchData and the popup opens with the page
    await waitFor(() => expect(screen.queryByText('London')).not.toBeNull());
    expect(fetchData).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Lisbon'));
    expect(onChange).toHaveBeenCalledWith({ target: { name: 'loc', value: PAGE[1] } });
});
