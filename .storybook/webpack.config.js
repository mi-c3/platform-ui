const path = require('path')

const storybookConfiguration = ({ config: defaultConfig, mode }) => {
  console.log('[Affectli] enhancing storybook webpack configuration...');
  const config = { ...defaultConfig };
  // config.module.rules.push({
  //   test: /\.css$/,
  //   loaders: ["style-loader", "css-loader", "sass-loader"],
  //   include: path.resolve(__dirname, '../src')
  // });
  // config.resolve.modules = ['node_modules', 'src'];
  // config.resolve.extensions.push('.css');
  config.resolve.alias = { '~@mdi/font/css/materialdesignicons.css': path.join(__dirname, '../node_modules/@mdi/font/css/materialdesignicons.css') };
  config.module.rules.push({
    test: /\.st\.js?$/,
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    enforce: 'pre',
  });

  if (process.env.BUILD_UI_MODULE) {
      console.log('[Affectli] BUILD_UI_MODULE...');
      config.entry = './src/index.js';

      config.output = {
          filename: 'index.es.js',
          publicPath: '',
          libraryTarget: "commonjs"
      };

      config.resolve.modules = [__dirname + '/src', 'node_modules'];

      config.optimization = {};
      config.externals = [/react$/, /react\-dom/, /@material-ui\/core\/*./, /@material-ui\/styles/];
      // delete config.module.loaders[0].exclude;
      // removed chunks options
      // config.plugins.splice(0, 1);
  }
  return config;
};

module.exports = storybookConfiguration;
