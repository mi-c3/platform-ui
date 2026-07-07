// rspack.config.js


const path = require('path');
const ESLintPlugin = require('eslint-rspack-plugin');

const babelOptions = require('./config/babel.middleware.js');
const fileLoader = require('./config/fileloader.middleware.js');

// Everything the consumer provides (peerDependencies) plus the packages we
// declare as regular dependencies but intentionally leave external. Deep
// imports (e.g. @mui/material/Button) are matched by prefix.
const EXTERNAL_PACKAGES = [
    '@emotion/react',
    '@emotion/styled',
    '@mui/material',
    '@mui/icons-material',
    '@mui/x-date-pickers',
    'fast-deep-equal',
    'google-map-react',
    'marked',
    'memoize-one',
    'moment',
    'prop-types',
    'react',
    'react-avatar-editor',
    'react-color',
    'react-dom',
    'react-dropzone',
    'react-mde',
    'react-router-dom',
    'react-tiny-virtual-list',
    'styled-components',
];

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        publicPath: '/',
        library: { type: 'module' },
    },
    resolve: {
        alias: {
            'utils': path.resolve(__dirname, 'src/utils')
        },
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                resolve: { fullySpecified: false },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions,
                },
            },
            ...fileLoader,
        ],
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['js', 'jsx'],
            exclude: ['node_modules'],
            emitWarning: true,
            overrideConfigFile: '.eslintrc.js'
        }),
    ],
    experiments: { outputModule: true, css: true },
    performance: {
        maxAssetSize: 500000,
        maxEntrypointSize: 500000,
    },
    externalsType: 'module',
    externals: [
        ({ request }, callback) => {
            const isExternal = EXTERNAL_PACKAGES.some(
                pkg => request === pkg || request.startsWith(`${pkg}/`)
            );
            return isExternal ? callback(null, `module ${request}`) : callback();
        },
    ],
};
