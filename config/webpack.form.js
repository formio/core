const path = require('path');
module.exports = {
  mode: 'development',
  entry: `./lib/form.js`,
  output: {
    library: 'Formio',
    libraryTarget: 'umd',
    libraryExport: 'Formio',
    path: path.resolve(__dirname, '../dist'),
    filename: 'formio.form.js',
    environment: {
      arrowFunction: false
    },
  }
};
