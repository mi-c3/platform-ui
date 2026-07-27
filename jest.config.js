process.env.NODE_ENV = process.env.NODE_ENV || 'test';

const babelOptions = require('./config/babel.js');

module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src', '<rootDir>/test'],
    testRegex: '.*(_test|_spec|\\.test|\\.spec)\\.(mjs|jsx|js)$',
    moduleNameMapper: {
        '\\.(css|less|scss)$': '<rootDir>/config/jest/styleMock.js',
        '\\.(jpg|jpeg|png|gif|svg|woff|woff2|ttf|eot|otf)$': '<rootDir>/config/jest/fileMock.js',
        '^utils/(.*)$': '<rootDir>/src/utils/$1',
        '^styles/(.*)$': '<rootDir>/src/styles/$1',
        '^components/(.*)$': '<rootDir>/src/components/$1',
    },
    setupFiles: ['<rootDir>/config/jest/setup.js'],
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    transform: {
        '^.+\\.(js|jsx|mjs)$': ['babel-jest', {
            ...babelOptions,
            // ESM-only react-router 8 uses `import.meta.hot`, which has no CJS
            // equivalent — see the plugin header.
            plugins: [...babelOptions.plugins, require.resolve('./config/babel-plugin-import-meta-jest.js')],
        }],
    },
    transformIgnorePatterns: [
        // react-router 8 and its cookie-es dep are ESM-only, so babel must transpile them.
        'node_modules/(?!(react-router|cookie-es)/)',
    ],
};
