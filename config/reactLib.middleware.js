const react = require('@neutrinojs/react');
const banner = require('@neutrinojs/banner');
const merge = require('deepmerge');
const { join } = require('path');

module.exports = ({ rootDir, ...opts }) => (neutrino) => {
    const options = merge(
        {
            html: process.env.NODE_ENV === 'development' && {
                title: 'React Preview',
            },
            externals: !!opts.externals,
            style: {
                extract: {
                    plugin: {
                        // Override the @neutrinojs/react production behaviour of hashed CSS
                        // filenames, and output to the build root, not an `assets/` subdirectory.
                        filename: '[name].css',
                    },
                },
            },
            devtool: {
                production: 'source-map',
            },
            targets: { browsers: 'ie 9' },
            entry: join(rootDir, 'src/index.js'),
        },
        opts
    );

    neutrino.config.when(
        process.env.NODE_ENV === 'development',
        () => {
            neutrino.use(react(options));
        },
        () => {
            const pkg = neutrino.options.packageJson || {};
            const hasSourceMap =
                (pkg.dependencies && 'source-map-support' in pkg.dependencies) ||
                (pkg.devDependencies && 'source-map-support' in pkg.devDependencies);

            neutrino.use(react(options));

            neutrino.config
                .when(options.externals, (config) => config.externals(options.externals))
                .when(hasSourceMap, () => neutrino.use(banner()))
                // Disable the chunking behaviour inherited from the react preset
                .optimization.splitChunks(false)
                .runtimeChunk(false)
                .end()
                .output // Override hashed filename/subdirectory usage inherited from @neutrinojs/react.
                .filename('[name].js')
                .library('[name]')
                .libraryTarget('umd')
                .umdNamedDefine(true);
        }
    );
};
