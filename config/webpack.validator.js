const path = require('path');
module.exports = {
  mode: 'development',
  entry: `./src/validator/index.ts`,
  output: {
    library: 'FormioValidator',
    libraryTarget: 'umd',
    libraryExport: 'Validator',
    path: path.resolve(__dirname, '../dist'),
    filename: 'formio.validator.js',
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
