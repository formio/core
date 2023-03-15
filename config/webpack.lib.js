const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: {
    'index': './src/index.ts',
    'base/index': './src/base/index.ts',
    'components/index': './src/components/index.ts',
    'model/index': './src/model/index.ts',
    'modules/index': './src/modules/index.ts',
    'sdk/index': './src/sdk/index.ts',
    'utils/index': './src/utils/index.ts',
    'validator/index': './src/validator/index.ts'
  },
  output: {
    path: path.resolve(__dirname, '../lib'),
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