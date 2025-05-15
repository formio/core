const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: {
    'formio.core.js': './lib/index.js',
    'formio.js': './lib/sdk/index.js',
    'formio.utils.js': './lib/utils/index.js',
    'formio.process.js': './lib/process/index.js',
  },
  output: {
    library: {
      type: 'umd',
      name: 'FormioCore',
    },
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]',
    environment: {
      arrowFunction: false,
    },
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
};
