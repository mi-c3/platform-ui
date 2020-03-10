const jest = require('@neutrinojs/jest');

const eslint = require('./config/eslint.middleware');
const babel = require('./config/babel.middleware');
const reactLib = require('./config/reactLib.middleware');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    eslint({ rootDir: __dirname }),
    reactLib({
      rootDir: __dirname,
      externals: {
          '@material-ui/core': 'commonjs2 @material-ui/core',
          '@material-ui/pickers': 'commonjs2 @material-ui/pickers',
          '@material-ui/styles': 'commonjs2 @material-ui/styles',
          react: 'commonjs2 react',
          'react-dom': 'commonjs2 react-dom',
          'react-router-dom': 'commonjs2 react-router-dom',
      }
    }),
    babel(),
    jest({
      setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js']
    }),
  ],
};
