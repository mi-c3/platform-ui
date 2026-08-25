process.env.NODE_ENV = process.env.NODE_ENV || 'test';

const babelOptions = require('./config/babel.middleware.js');

// The build keeps `modules: false` so rspack can tree-shake ES modules, but Jest runs
// through CommonJS, so preset-env has to emit CJS for tests only.
const testPresets = babelOptions.presets.map((preset) => {
    if (Array.isArray(preset) && preset[0] === '@babel/preset-env') {
        return [preset[0], { ...preset[1], modules: 'commonjs' }];
    }
    return preset;
});

module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src', '<rootDir>/test'],
    testRegex: '.*(_test|_spec|\\.test|\\.spec)\\.(mjs|jsx|js)$',
    moduleFileExtensions: ['js', 'jsx', 'mjs', 'json'],
    moduleNameMapper: {
        '\\.(css|less|scss)$': '<rootDir>/config/jest/styleMock.js',
        '\\.(jpg|jpeg|png|gif|svg|woff|woff2|ttf|eot|otf)$': '<rootDir>/config/jest/fileMock.js',
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    transform: {
        '^.+\\.(js|jsx|mjs)$': ['babel-jest', { ...babelOptions, presets: testPresets }],
    },
};
