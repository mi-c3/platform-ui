const jest = require('@neutrinojs/jest');

module.exports = () =>
    jest({
        setupFilesAfterEnv: ['<rootDir>/config/jest/jest.setup.js'],
    });
