module.exports = require('./webpack.config.js')({
  entry: `./src/base/index.ts`,
  output: {
    library: 'FormioBase',
    filename: 'formio.base.js'
  }
});
