module.exports = ({ rspack } = {}) => {
    const config = {
        'env': {
            'es6': true,
            'browser': true,
            'node': true,
            'jest': true,
            'amd': true
        },
        'plugins': [
            'graphql',
            'react',
            'react-hooks'
        ],
        'extends': [
            'plugin:react/recommended'
        ],
        'rules': {
            'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }],
            'indent': ['warn', 4, { 'SwitchCase': 1, 'ignoredNodes': ['TemplateLiteral'] }],
            'max-len': [
                'warn',
                160,
                {
                    'ignoreComments': true,
                    'ignoreStrings': true,
                    'ignoreRegExpLiterals': true,
                    'ignoreTemplateLiterals': true,
                    'ignoreTrailingComments': true,
                    'ignoreUrls': true
                }
            ],
            'no-unused-vars': ['warn', { 'args': 'none', 'ignoreRestSiblings': true }],
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'off',
            'react/no-children-prop': 'off',
            'react/no-unknown-property': 'off',
            'no-console': ['warn', { 'allow': ['warn', 'error'] }],
            'prefer-const': 'warn',
            'semi': 'off',
            'react/forbid-prop-types': 'off',
            'react/forbid-foreign-prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'template-curly-spacing': 'off'
        },
        'parserOptions': {
            'ecmaVersion': 2020,
            'sourceType': 'module',
            'ecmaFeatures': {
                'jsx': true
            }
        }
    }
  

    if (!rspack) {
        config.root = true
        config.env.commonjs = true
        config.plugins.push('babel', 'jest')
        config.extends.push('plugin:jest/recommended', 'plugin:ft-flow/recommended')
        config.globals = {
            'process': true,
            '__DEV__': true
        }
        config.parser = '@babel/eslint-parser'
        config.parserOptions = {
            'requireConfigFile': true,
            'babelOptions': {
                'configFile': './config/babel.middleware.js'
            },
            ...config.parserOptions
        }
        config.settings = {
            'react': {
                'version': 'detect'
            }
        }
        config.rules = {
            ...config.rules,
            'jest/valid-expect': 'off',
            'ft-flow/no-types-missing-file-annotation': 'off',
        }
    }

    return config;
}
