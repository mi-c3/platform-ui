import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import css from 'rollup-plugin-css-only';
import includePaths from 'rollup-plugin-includepaths';

import pkg from './package.json';

const includePathOptions = {
    include: {},
    paths: ['src'],
    external: [],
    extensions: ['.js', '.json', '.css'],
};

export default {
    input: 'src/index.js',
    output: [
        {
            file: pkg.module,
            format: 'cjs',
            // format: 'es',
            sourcemap: true,
        },
    ],
    plugins: [
        includePaths(includePathOptions),
        css({ output: './dist/bundle.css' }),
        external(),
        url({ exclude: ['**/*.svg'] }),
        babel({
            exclude: 'node_modules/**',
        }),
        resolve(),
        commonjs({
            namedExports: {
                'node_modules/react-is/index.js': ['isValidElementType', 'ForwardRef', 'isFragment'],
                'node_modules/showdown/index.js': ['Converter'],
            },
            include: /node_modules/,
        }),
    ],
    external: [
        // 'showdown',
        'react',
        'react-dom',
        'prop-types',
        '@material-ui/core',
        '@material-ui/styles',
        '@material-ui/pickers',
        'react-jss',
        'react-router-dom',
        'react-router',
    ],
};
