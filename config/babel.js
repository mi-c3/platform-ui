const { join } = require('path');

// Shared Babel configuration, consumed by rspack (babel-loader), jest
// (babel-jest) and the eslint parser — see config/eslint.js.
module.exports = {
    presets: [
        [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
        ['@babel/preset-env', {
            targets: {
                chrome: '115'
            },
            // jest needs commonjs; the library build stays ESM
            modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
            bugfixes: true,
            useBuiltIns: false
        }]
    ],
    plugins: [
        [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
        [require.resolve('@babel/plugin-proposal-class-properties'), {
            loose: true,
            shippedProposals: true,
        }],
        // makes `utils/...`, `styles/...`, `components/...` resolve from src/
        [require.resolve('babel-plugin-module-resolver'), { root: [join(__dirname, '../src')] }],
        require.resolve('babel-plugin-styled-components'),
    ],
};
