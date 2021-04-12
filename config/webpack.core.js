module.exports = require('./webpack.config.js')({
  entry: `./src/core/index.ts`,
  output: {
    library: 'FormioCore',
    filename: 'formio.core.js'
  }
});
