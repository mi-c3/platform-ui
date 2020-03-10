const lint = require('@neutrinojs/eslint');
const { join } = require('path');

module.exports = ({ eslint = {}, rootDir, ...opts } = {}) => (neutrino) => {
    const baseConfig = eslint.baseConfig || {};
    neutrino.use(
        lint({
            ...opts,
            eslint: {
                ...eslint,
                baseConfig: {
                    ...baseConfig,
                    plugins: ['jsx-a11y', 'react', 'react-hooks'],
                    settings: {
                        react: {
                            version: require(join(rootDir, 'package.json')).dependencies.react,
                        },
                    },
                    parserOptions: {
                        ecmaFeatures: {
                            modules: true,
                            restParams: true,
                            spread: true,
                            jsx: true,
                        },
                        ecmaVersion: 2018,
                        sourceType: 'module',
                    },
                    extends: [
                        'eslint:recommended',
                        'plugin:jsx-a11y/recommended',
                        'plugin:react/recommended',
                        'plugin:prettier/recommended',
                    ],
                    rules: {
                        ...baseConfig.rules,
                        quotes: ['warn', 'single', { allowTemplateLiterals: true }],
                        indent: ['warn', 4, { SwitchCase: 1 }],
                        'max-len': [
                            'warn',
                            160,
                            {
                                ignoreComments: true,
                                ignoreStrings: true,
                                ignoreRegExpLiterals: true,
                                ignoreTemplateLiterals: true,
                                ignoreTrailingComments: true,
                                ignoreUrls: true,
                            },
                        ],
                        'no-console': 'warn',
                        'no-debugger': 'warn',
                        'prefer-const': 'warn',
                        semi: 'warn',
                        'no-unused-vars': 'warn',
                        'react-hooks/rules-of-hooks': 'error',
                        'react-hooks/exhaustive-deps': 'warn',
                    },
                },
            },
        })
    );
};
