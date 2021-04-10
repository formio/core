module.exports = require('./webpack.config.js')({
  entry: `./src/validator/index.ts`,
  output: {
    library: 'FormioValidator',
    libraryExport: 'Validator',
    filename: 'formio.validator.js',
  }
});
