const reactLib = require('./reactLib.middleware');

module.exports = ({ rootDir }) =>
    reactLib({
        rootDir,
        externals: {
            '@date-io/moment': 'commonjs2 @date-io/moment',
            '@material-ui/core': 'commonjs2 @material-ui/core',
            '@material-ui/icons': 'commonjs2 @material-ui/icons',
            '@material-ui/pickers': 'commonjs2 @material-ui/pickers',
            '@material-ui/styles': 'commonjs2 @material-ui/styles',
            'fast-deep-equal': 'commonjs2 fast-deep-equal',
            'google-map-react': 'commonjs2 google-map-react',
            jss: 'commonjs2 jss',
            marked: 'commonjs2 marked',
            'memoize-one': 'commonjs2 memoize-one',
            moment: 'commonjs2 moment',
            react: 'commonjs2 react',
            'react-avatar-editor': 'commonjs2 react-avatar-editor',
            'react-color': 'commonjs2 react-color',
            'react-dom': 'commonjs2 react-dom',
            'react-dropzone': 'commonjs2 react-dropzone',
            'react-jss': 'commonjs2 react-jss',
            'react-mde': 'commonjs2 react-mde',
            'react-router-dom': 'commonjs2 react-router-dom',
            'react-tiny-virtual-list': 'commonjs2 react-tiny-virtual-list',
            'styled-components': 'commonjs2 styled-components',
        },
    });
