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
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    transform: {
        '^.+\\.(js|jsx|mjs)$': ['babel-jest', babelOptions],
    },
};
