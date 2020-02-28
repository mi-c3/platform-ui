const babelConfig = (config) => ({
  ...config,
  plugins: [
    [
      '@babel/plugin-proposal-decorators', { "legacy": true }
    ],
    ...config.plugins,
    ['module-resolver', {
        // "root": ["./src"],
        "alias": {
          "components": "./src/components",
          "styles": "./src/styles",
          "utils": "./src/utils"
        }
    }]
  ]
});

module.exports = {
  managerBabel: async (config, options) => {
    // console.log('$$$ [managerBabel]', config, options);
    return babelConfig(config);
  },
  babel: async (config, options) => {
    // console.log('$$$ [config]', babelConfig(config));
    return babelConfig(config);
  },
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions/register',
    '@storybook/addon-storysource',
    '@storybook/addon-knob/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-links/register',

    '@storybook/addon-events/register',
    '@storybook/addon-notes/register',
    // '@storybook/addon-options',
    '@storybook/addon-cssresources/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-jest/register',
  ],
};
