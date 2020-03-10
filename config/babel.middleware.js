const babelMerge = require('babel-merge');

module.exports = () => (neutrino) => {
    neutrino.config.module
        .rule('compile')
        .use('babel')
        .tap((options) =>
            babelMerge(
                {
                    plugins: [
                        [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
                        require.resolve('@babel/plugin-proposal-class-properties'),
                        [require.resolve('@babel/plugin-transform-runtime'), { regenerator: true }],
                    ],
                },
                options
            )
        );
};
