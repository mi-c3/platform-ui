import React from 'react';
import ThemeProvider from '@emotion/provider';
import JSXAddon from 'storybook-addon-jsx';
import { configure, addDecorator, setAddon } from '@storybook/react';
import { themes } from '@storybook/components';
import { withOptions } from '@storybook/addon-options';
import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withCssResources } from '@storybook/addon-cssresources';
import 'react-chromatic/storybook-addon';
import extraViewports from './extra-viewports.json';

import MomentUtils from '@date-io/moment';
import { MuiThemeProvider, DarkTheme, MuiPickersUtilsProvider } from '../src/index';

import '~@mdi/font/css/materialdesignicons.css';

addDecorator(
  withOptions({
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
    theme: themes.dark,
    name: 'Affectli Platform-UI',
    addonPanelInRight: false, // set panel right by default if 'true'
  })
);

addDecorator(
  withCssResources({
    cssresources: [
      {
        name: `white`,
        code: `<style>
    body {
        background-color: white;
        transition: background-color 0.3s;
    }
</style>`,
        picked: false,
      },
    ],
  })
);

addDecorator((story, { kind }) =>
  kind === 'Core|Errors' ? story() : (
      <ThemeProvider theme={themes.normal}>
          <MuiThemeProvider theme={DarkTheme}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                  {story()}
              </MuiPickersUtilsProvider>
          </MuiThemeProvider>
      </ThemeProvider>
      )
);

configureViewport({
  viewports: {
    ...INITIAL_VIEWPORTS,
    ...extraViewports,
  },
});

setAddon(JSXAddon);

const req = require.context('../src/stories', true, /index\.js|\.st\.js$/)

function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
