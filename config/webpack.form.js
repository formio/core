module.exports = require('./webpack.config.js')({
  entry: `./src/index.ts`,
  output: {
    library: 'Formio',
    filename: 'formio.form.js'
  }
});
