const { WorkboxPlugin } = require('workbox-webpack-plugin');
const swConfig = require('./sw-config');

module.exports = {
  webpack: function(config, env) {
    // Add WorkboxWebpackPlugin to generate service worker
    config.plugins.push(
      new WorkboxPlugin.InjectManifest({
        swSrc: './src/service-worker.js',
        swDest: 'service-worker.js',
        ...swConfig,
      })
    );

    return config;
  }
};