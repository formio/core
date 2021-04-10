const path = require('path');
module.exports = {
  mode: 'development',
  entry: `./src/form.ts`,
  output: {
    library: 'Formio',
    libraryTarget: 'umd',
    libraryExport: 'Formio',
    path: path.resolve(__dirname, '../dist'),
    filename: 'formio.form.js',
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
