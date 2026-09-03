import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import ColorPicker from '../../src/components/ColorPicker';

// Regression suite for the mobile click-through: react-color's SwatchesPicker is a class
// component with no DOM ref, so MUI v5+ ClickAwayListener (no findDOMNode) read EVERY tap —
// including taps on a swatch — as "away": the palette unmounted on touchend and the browser's
// compat click landed on the field behind it. The palette is now wrapped in a host <div>.

const renderPicker = (props = {}) => {
    const onChange = jest.fn();
    const utils = render(<ColorPicker name="iconColor" label="Icon color" value="#26a69a" onChange={onChange} {...props} />);
    return { ...utils, onChange };
};

const openPalette = async container => {
    fireEvent.click(container.querySelector('.MuiFormControl-root'));
    // ClickAwayListener arms its document listeners in a setTimeout after mount
    await act(async () => new Promise(resolve => setTimeout(resolve, 20)));
    const palette = container.querySelector('.swatches-picker');
    expect(palette).toBeTruthy();
    return palette;
};

const swatchIn = (container, index = 3) => container.querySelectorAll('.swatches-picker div[title^="#"]')[index];

describe('ColorPicker palette interaction (mobile tap-race regression)', () => {
    test('touchend on a swatch does NOT close the palette', async () => {
        const { container } = renderPicker();
        await openPalette(container);
        const swatch = swatchIn(container);
        fireEvent.touchStart(swatch);
        fireEvent.touchEnd(swatch);
        await act(async () => new Promise(resolve => setTimeout(resolve, 20)));
        expect(container.querySelector('.swatches-picker')).toBeTruthy();
    });

    test('the tap sequence (touch then compat click) selects the color and keeps the palette open', async () => {
        const { container, onChange } = renderPicker();
        await openPalette(container);
        const swatch = swatchIn(container);
        const hex = swatch.getAttribute('title').toLowerCase();
        fireEvent.touchStart(swatch);
        fireEvent.touchEnd(swatch);
        fireEvent.click(swatch);
        await act(async () => new Promise(resolve => setTimeout(resolve, 20)));
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'iconColor', value: hex } });
        expect(container.querySelector('.swatches-picker')).toBeTruthy();
    });

    test('desktop click on a swatch selects and keeps the palette open (was closing after select)', async () => {
        const { container, onChange } = renderPicker();
        await openPalette(container);
        const swatch = swatchIn(container, 5);
        const hex = swatch.getAttribute('title').toLowerCase();
        fireEvent.mouseDown(swatch);
        fireEvent.mouseUp(swatch);
        fireEvent.click(swatch);
        await act(async () => new Promise(resolve => setTimeout(resolve, 20)));
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'iconColor', value: hex } });
        expect(container.querySelector('.swatches-picker')).toBeTruthy();
    });

    test('a click OUTSIDE the palette still closes it', async () => {
        const { container } = renderPicker();
        await openPalette(container);
        fireEvent.click(document.body);
        await act(async () => new Promise(resolve => setTimeout(resolve, 20)));
        expect(container.querySelector('.swatches-picker')).toBeNull();
    });

    test('a touchend OUTSIDE the palette still closes it', async () => {
        const { container } = renderPicker();
        await openPalette(container);
        fireEvent.touchEnd(document.body);
        await act(async () => new Promise(resolve => setTimeout(resolve, 20)));
        expect(container.querySelector('.swatches-picker')).toBeNull();
    });

    test('clicking the field toggles the palette', async () => {
        const { container } = renderPicker();
        await openPalette(container);
        fireEvent.click(container.querySelector('.MuiFormControl-root'));
        await act(async () => new Promise(resolve => setTimeout(resolve, 20)));
        expect(container.querySelector('.swatches-picker')).toBeNull();
    });
});

describe('field tap on a touch device (guard regression)', () => {
    // touchend (document click-away) and the browser's compat click (FormControl toggle) are
    // separate dispatches on a real device — without the wrapperRef guard they double-fire
    // and the field can never close its own palette.
    test('touch tap on the field, then its compat click, closes the palette', async () => {
        const { container } = renderPicker();
        await openPalette(container);
        const field = container.querySelector('.MuiFormControl-root');
        fireEvent.touchStart(field);
        fireEvent.touchEnd(field);
        fireEvent.click(field);
        await act(async () => new Promise(resolve => setTimeout(resolve, 20)));
        expect(container.querySelector('.swatches-picker')).toBeNull();
    });
});
