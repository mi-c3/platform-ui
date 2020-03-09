const eslintMiddleware = require('./.eslintrc.middleware.js');
const jest = require('@neutrinojs/jest');
const babelMerge = require('babel-merge');
const reactLib = require('./config/reactLib');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    eslintMiddleware(),
    reactLib({
      externals: {
          '@material-ui/core': 'commonjs2 @material-ui/core',
          '@material-ui/pickers': 'commonjs2 @material-ui/pickers',
          '@material-ui/styles': 'commonjs2 @material-ui/styles',
          react: 'commonjs2 react',
          'react-dom': 'commonjs2 react-dom',
          'react-router-dom': 'commonjs2 react-router-dom',
      }
    }),
    neutrino => {
      neutrino.config.module
        .rule('compile')
        .use('babel')
        .tap(options =>
          babelMerge(
            {
              plugins: [
                [ require.resolve('@babel/plugin-proposal-decorators'), { legacy: true } ],
                require.resolve('@babel/plugin-proposal-class-properties'),
                [ require.resolve('@babel/plugin-transform-runtime'), { regenerator: true } ]
              ],
            },
            options,
          ),
        )
    },
    jest(),
  ],
};
