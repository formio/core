const path = require('path');
module.exports = {
  mode: 'development',
  entry: `./lib/Formio.js`,
  output: {
    library: 'Formio',
    libraryTarget: 'umd',
    libraryExport: 'Formio',
    path: path.resolve(__dirname, '../dist'),
    filename: 'formio.js',
    environment: {
      arrowFunction: false
    },
  }
};
