const eslint = require('./config/eslint.middleware');
const babel = require('./config/babel.middleware');
const react = require('./config/react/react.middleware');
const jest = require('./config/jest/jest.middleware');

const fileLoader = (neutrino) => {
  neutrino.config.module
    .rule('fonts')
    .test(/\.(eot|ttf|woff|woff2|svg)$/)
    .use('file')
    .loader('file-loader')
    .options({
      name: 'assets/[name].[hash:8].[ext]',
      publicPath: './', // Set publicPath to ensure the URLs are relative
    });
};

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    fileLoader,
    eslint({ rootDir: __dirname }),
    react({ rootDir: __dirname }),
    babel({ rootDir: __dirname }),
    jest(),
  ],
};
