const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const storybookConfiguration = (baseConfig, env, defaultConfig) => {
  console.log('[Affectli] enhancing storybook webpack configuration...');
  const config = { ...defaultConfig };
  config.module.rules.push({
    test: /\.css$/,
    loaders: ["style-loader", "css-loader", "sass-loader"],
    include: path.resolve(__dirname, '../src')
  });
  config.resolve.extensions.push('.css');
  config.resolve.modules = ['node_modules', 'src'];
  config.resolve.alias = { '~@mdi/font/css/materialdesignicons.css': path.join(__dirname, '../node_modules/@mdi/font/css/materialdesignicons.css') };

  if (process.env.BUILD_UI_MODULE) {
      console.log('[Affectli] BUILD_UI_MODULE...');
      config.entry = './src/index.js';

      config.output = {
          filename: 'index.es.js',
          publicPath: '',
          libraryTarget: "commonjs"
      };

      config.plugins.push(new ExtractTextPlugin('style.css'));

      config.resolve.modules = [__dirname + '/src', 'node_modules'];

      config.optimization = {};

      // removed chunks options
      // config.plugins.splice(0, 1);
  }
  return config;
};

module.exports = storybookConfiguration;
