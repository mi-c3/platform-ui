const { join } = require('path');
// Babel Configuration (babel.middleware.js)

module.exports = {
    presets: [
        require.resolve('@babel/preset-react'), 
        ['@babel/preset-env', {
            targets: {
                chrome: '115' // или укажите вашу целевую версию
            },
            modules: false, // не транспилируем ES-модули (если поддерживается)
            bugfixes: true, // включает некоторые исправления для современных браузеров
            useBuiltIns: false // отключает полифиллы, если они вам не нужны
        }]
    ],
    plugins: [
        [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
        [require.resolve('@babel/plugin-proposal-class-properties'), {
            loose: true,
            shippedProposals: true,
        }],
        [require.resolve('babel-plugin-module-resolver'), { root: [join(__dirname, '../src')] }],
        require.resolve('babel-plugin-styled-components'),
        '@babel/plugin-syntax-import-meta'
    ],
};
