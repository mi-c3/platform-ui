import React from 'react';
import { configure, addParameters, addDecorator } from '@storybook/react';
import { create } from '@storybook/theming';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withCssResources } from '@storybook/addon-cssresources';
import { withA11y } from '@storybook/addon-a11y';
import { withNotes } from '@storybook/addon-notes';

import extraViewports from './extra-viewports.json';
import '~@mdi/font/css/materialdesignicons.css';

import PuiProvider from '../src/components/PuiProvider';

import { colors } from '../src/styles/theme';

addDecorator(withCssResources);
addDecorator(withA11y);
addDecorator(withNotes);

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
    a11y: {
      configure: {},
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
    },
    options: {
        theme: create({
          base: 'dark',

          colorPrimary: colors.primary.dark,
          colorSecondary: colors.secondary.dark,

          // UI
          appBg: colors.background,
          appContentBg: 'rgba(0,0,0,0.1)',
          appBorderColor: colors.darkBlue,
          appBorderRadius: 4,

          // Typography
          fontBase: '"Open Sans", sans-serif',
          fontCode: 'monospace',

          // Text colors
          textColor: 'white',
          textInverseColor: 'rgba(0,0,0,0.8)',

          // Toolbar default and active colors
          barTextColor: 'rgba(255,255,255,0.9)',
          barSelectedColor: 'white',
          barBg: colors.primary.dark,

          // Form colors
          inputBg: colors.background,
          inputBorder: colors.primary.dark,
          inputTextColor: 'white',
          inputBorderRadius: 4,

          brandTitle: 'Affectli Platform-UI',
          brandUrl: 'https://affectli.dev.mi-c3.com/',
          brandImage: 'https://affectli.dev.mi-c3.com/images/logo.192x192.png',
        }),
        panelPosition: 'bottom',
        backgrounds: [
          { name: 'storybook app', value: colors.background, default: true },
          { name: 'light', value: '#eeeeee' },
          { name: 'dark', value: '#222222' },
        ],
    }
});

// automatically import all files ending in *.stories.js
const req = require.context('../src/stories', true, /\.st\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
