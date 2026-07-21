import React from 'react';
import { render } from '@testing-library/react';
import { DropzoneDialog } from '../../src';

test('respects the fullScreen prop', () => {
    render(<DropzoneDialog open fullScreen onClose={() => {}} />);
    expect(document.querySelector('.MuiDialog-paperFullScreen')).not.toBeNull();
});

test('is not full screen by default', () => {
    render(<DropzoneDialog open onClose={() => {}} />);
    expect(document.querySelector('.MuiDialog-paperFullScreen')).toBeNull();
});
