const path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    'index.js': './src/index.ts',
    'base/index.js': './src/base/index.ts',
    'components/index.js': './src/components/index.ts',
    'model/index.js': './src/model/index.ts',
    'modules/index.js': './src/modules/index.ts',
    'sdk/index.js': './src/sdk/index.ts',
    'utils/index.js': './src/utils/index.ts',
    'validator/index.js': './src/validator/index.ts'
  },
  output: {
    library: 'Formio',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../lib'),
    filename: '[name]',
    environment: {
      arrowFunction: false
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
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