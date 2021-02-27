const config = require('./webpack.formio');
config.mode = 'production';
config.output.filename = 'formio.min.js';
module.exports = config;
