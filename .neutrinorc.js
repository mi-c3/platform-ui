
const eslint = require('./config/eslint.middleware');
const babel = require('./config/babel.middleware');
const react = require('./config/react/react.middleware');
const jest = require('./config/jest/jest.middleware');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    eslint({ rootDir: __dirname }),
    react({ rootDir: __dirname }),
    babel({ rootDir: __dirname }),
    jest(),
  ],
};
