import React from 'react';
import { render } from '@testing-library/react';
import { Dropzone } from '../../src';

/**
 * Regression coverage for the iOS "always opens the camera" bug.
 *
 * `capture` is an overloaded-boolean DOM attribute: React renders `capture={true}` as
 * `capture=""`. iOS Safari treats the *presence* of the attribute on `<input type="file">`
 * as "skip the chooser, open the camera now", so a truthy default silently removed
 * "Photo Library" / "Choose File" from the native sheet on every iPhone.
 *
 * The native sheet itself cannot be asserted from jsdom, so these tests pin the DOM
 * contract that drives it: whether the attribute is emitted at all.
 */
const fileInput = (container) => container.querySelector('input[type="file"]');

describe('Dropzone file input capture contract', () => {
    it('omits the capture attribute by default so iOS shows the native chooser', () => {
        const { container } = render(<Dropzone dropzoneText="Drop here" />);
        const input = fileInput(container);

        expect(input).toBeInTheDocument();
        expect(input.hasAttribute('capture')).toBe(false);
    });

    it('omits the capture attribute by default when rendering custom children', () => {
        const { container } = render(
            <Dropzone dropzoneText="Drop here">
                <span>upload</span>
            </Dropzone>
        );

        expect(fileInput(container).hasAttribute('capture')).toBe(false);
    });

    it('omits the capture attribute when a caller explicitly opts out', () => {
        const { container } = render(<Dropzone capture={false} />);

        expect(fileInput(container).hasAttribute('capture')).toBe(false);
    });

    it('still lets a caller opt in to the outward-facing camera', () => {
        const { container } = render(<Dropzone capture="environment" />);

        expect(fileInput(container).getAttribute('capture')).toBe('environment');
    });

    it('still lets a caller opt in to the user-facing camera', () => {
        const { container } = render(<Dropzone capture="user" />);

        expect(fileInput(container).getAttribute('capture')).toBe('user');
    });

    it('keeps the legacy boolean opt-in working', () => {
        const { container } = render(<Dropzone capture />);

        // Overloaded boolean: present, empty value.
        expect(fileInput(container).getAttribute('capture')).toBe('');
    });
});

describe('Dropzone file input unrelated behaviour is preserved', () => {
    it('keeps the default accept list so existing file restrictions are unchanged', () => {
        const { container } = render(<Dropzone />);

        expect(fileInput(container).getAttribute('accept')).toBe('image/*,video/*,application/*,audio/*,text/*');
    });

    it('honours a caller-supplied accept string', () => {
        const { container } = render(<Dropzone accept="image/png" />);

        expect(fileInput(container).getAttribute('accept')).toBe('image/png');
    });

    it('honours multiple for multi-file pickers', () => {
        const { container } = render(<Dropzone multiple />);

        expect(fileInput(container).hasAttribute('multiple')).toBe(true);
    });
});
