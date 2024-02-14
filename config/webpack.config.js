const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: {
    'formio.core.js': './src/index.ts',
    'formio.modules.js': './src/modules/index.ts',
    'formio.js': './src/sdk/index.ts',
    'formio.utils.js': './src/utils/index.ts',
    'formio.process.js': './src/process/index.ts'
  },
  output: {
    library: {
      type: 'umd',
      name: 'FormioCore'
    },
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]',
    environment: {
      arrowFunction: false
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({
      configFile: path.resolve(__dirname, '..', 'tsconfig.json')
    })]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /\.spec\.ts$/,
        loader: "ts-loader"
      }
    ]
  }
};
