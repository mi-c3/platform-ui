const { join } = require('path');

// Whilst the configuration object can be modified here, the recommended way of making
// changes is via the presets' options or Neutrino's API in `.neutrinorc.js` instead.
// Neutrino's inspect feature can be used to view/export the generated configuration.
const neutrino = require('neutrino');

// TODO: customize webpack using the recommended ways
const config = neutrino().webpack();
if (config.mode === 'production') {
  config.entry = { exports: [join(__dirname, 'src/index.js')] };
}

module.exports = config;
