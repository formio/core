const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
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
    'validation/index.js': './src/processes/validation/index.ts'
  },
  output: {
    library: {
      type: 'umd'
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
