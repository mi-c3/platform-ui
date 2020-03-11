const neutrino = require('neutrino');

const config = neutrino().webpack();

if (process.env.HOT === 'true') {
    if (config.optimization && config.optimization.minimize) {
        config.optimization.minimize = false;
    }
    if (Array.isArray(config.plugins)) {
        config.plugins = config.plugins.filter((plugin) => plugin.constructor && plugin.constructor.name !== 'CleanWebpackPlugin');
    }
}

module.exports = config;
