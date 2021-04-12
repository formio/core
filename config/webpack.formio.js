module.exports = require('./webpack.config.js')({
  entry: `./src/sdk/index.ts`,
  output: {
    library: 'Formio',
    filename: 'formio.js'
  }
});
