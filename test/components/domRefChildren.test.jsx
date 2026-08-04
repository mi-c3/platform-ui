import React from 'react';
import { render } from '@testing-library/react';
import { Grow, Tooltip } from '@mui/material';
import { Checkbox, Radio, Slider, Switch, TextField } from '../../src';

/**
 * MUI v5+ clones the child of `Tooltip` and of the cloning transitions
 * (`Fade`/`Grow`/`Slide`/`Zoom`) with a ref, then reads the DOM node it gets back —
 * `getAttribute` for Tooltip, `node.style` for a transition. A class component hands
 * back its instance instead, so both throw:
 *
 *   TypeError: childNode.getAttribute is not a function
 *   TypeError: Cannot set properties of undefined (setting 'transition')
 *
 * Every component below is class-based, so each one forwards its ref down to the root
 * DOM node. This test pins that: it fails the moment a component stops forwarding.
 */
const noop = () => {};

const COMPONENTS = [
    ['Checkbox', <Checkbox key="a" value={false} />],
    ['Radio', <Radio key="b" value={false} />],
    ['Slider', <Slider key="c" onChange={noop} />],
    ['Switch', <Switch key="d" value={false} />],
    ['TextField', <TextField key="e" onChange={noop} />],
];

const withProviders = (ui) => ui;

describe('components can be a child of Tooltip and of a MUI transition', () => {
    it.each(COMPONENTS)('%s works as a Tooltip child', (_name, element) => {
        expect(() => render(withProviders(<Tooltip title="tip">{element}</Tooltip>))).not.toThrow();
    });

    it.each(COMPONENTS)('%s works as a Grow child', (_name, element) => {
        expect(() => render(withProviders(<Grow in appear>{element}</Grow>))).not.toThrow();
    });
});
