const eslintMiddleware = require('./.eslintrc.middleware.js');
const jest = require('@neutrinojs/jest');
const babelMerge = require('babel-merge');
const standardjs = require('@neutrinojs/standardjs');
const reactComponents = require('@neutrinojs/react-components');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    eslintMiddleware(),
    reactComponents(),
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
                // [require.resolve('module-resolver'), {
                //     "root": ["./src"],
                //     "alias": {
                //       "components": "./src/components",
                //       "styles": "./src/styles",
                //       "utils": "./src/utils"
                //     }
                // }]

              ],
            },
            options,
          ),
        )
      // neutrino.config.resolve
      //   .modules
      //     .add(neutrino.options.source);

    },
    jest(),
  ],
};
