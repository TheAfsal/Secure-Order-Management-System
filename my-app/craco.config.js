const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        constants: require.resolve('constants-browserify'),
        buffer: require.resolve('buffer/'),
        assert: require.resolve('assert/'),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser.js'),
        vm: require.resolve('vm-browserify'),
      };

      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser.js',
        }),
      ]);

      webpackConfig.module = webpackConfig.module || {};
      webpackConfig.module.rules = (webpackConfig.module.rules || []).concat([
        {
          test: /\.pem$/,
          type: 'asset/source',
        },
      ]);

      return webpackConfig;
    },
  },
};