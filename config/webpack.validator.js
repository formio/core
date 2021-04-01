const path = require('path');
module.exports = {
  mode: 'development',
  entry: `./lib/validator/index.js`,
  output: {
    library: 'FormioValidator',
    libraryTarget: 'umd',
    libraryExport: 'Validator',
    path: path.resolve(__dirname, '../dist'),
    filename: 'formio.validator.js',
    environment: {
      arrowFunction: false
    },
  }
};
