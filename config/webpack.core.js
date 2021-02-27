const path = require('path');
module.exports = {
  mode: 'development',
  entry: `./lib/index.js`,
  output: {
    library: 'FormioCore',
    libraryTarget: 'umd',
    libraryExport: 'Formio',
    path: path.resolve(__dirname, '../dist'),
    filename: 'formio.core.js',
    environment: {
      arrowFunction: false
    },
  }
};
