const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');
const babelMerge = require('babel-merge');
const standardjs = require('@neutrinojs/standardjs');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    // airbnb({
    //   eslint: {
    //     baseConfig: {
    //       extends: [
    //         "eslint:recommended",
    //         "plugin:prettier/recommended"
    //       ],
    //       settings: {
    //         "import/resolver": {
    //           "node": {
    //             "paths": ["src"]
    //           }
    //         },
    //       },
    //       // globals: {
    //       //   "__DEV__": true
    //       // },
    //     },
    //     rules: {
    //       "class-methods-use-this": "off",
    //       "react/jsx-curly-newline": "off",
    //       "no-underscore-dangle": "off",
    //       "import/prefer-default-export": "off",
    //       "react/jsx-filename-extension": "off",
    //       "quotes": [ "warn", "single", { "allowTemplateLiterals": true }],
    //       "indent": [ "warn", 4, { "SwitchCase": 1 } ],
    //       "max-len": ["warn", 160, {
    //         "ignoreComments": true,
    //         "ignoreStrings": true,
    //         "ignoreRegExpLiterals": true,
    //         "ignoreTemplateLiterals": true,
    //         "ignoreTrailingComments": true,
    //         "ignoreUrls": true
    //       }],
    //       "no-console": "warn",
    //       "no-debugger": "warn",
    //       "prefer-const": "warn",
    //       "semi": "warn",
    //       "no-unused-vars": "warn",
    //       "react-hooks/rules-of-hooks": "error",
    //       "react-hooks/exhaustive-deps": "warn"
    //     }
    //   }
    // }),
    react({
      html: {
        title: 'platform-ui'
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
