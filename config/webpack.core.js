const path = require('path');
module.exports = {
  mode: 'development',
  entry: `./src/index.ts`,
  output: {
    library: 'FormioCore',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../dist'),
    filename: 'formio.core.js',
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
