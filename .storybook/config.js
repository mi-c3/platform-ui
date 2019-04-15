import React from 'react';
import { configure, addParameters, addDecorator } from '@storybook/react';
import { create } from '@storybook/theming';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import extraViewports from './extra-viewports.json';
import '~@mdi/font/css/materialdesignicons.css';

import PuiProvider from '../src/components/PuiProvider';

addDecorator((story) => (
    <PuiProvider>
        {story()}
    </PuiProvider>
));

addParameters({
  viewport: {
    ...INITIAL_VIEWPORTS,
    ...extraViewports,
  },
});

addParameters({
    options: {
        theme: create({
          base: 'dark',
          brandTitle: 'Affectli Platform-UI',
        }),
        panelPosition: 'bottom',
    }
});

// automatically import all files ending in *.stories.js
const req = require.context('../src/stories', true, /\.st\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
