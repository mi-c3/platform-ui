const reactLib = require('./reactLib.middleware');

module.exports = ({ rootDir }) =>
    reactLib({
        rootDir,
        externals: {
            '@material-ui/core': 'commonjs2 @material-ui/core',
            '@material-ui/pickers': 'commonjs2 @material-ui/pickers',
            '@material-ui/styles': 'commonjs2 @material-ui/styles',
            react: 'commonjs2 react',
            'react-dom': 'commonjs2 react-dom',
            'react-router-dom': 'commonjs2 react-router-dom',
        },
    });
