const config = require('./webpack.validator');
config.mode = 'production';
config.output.filename = 'formio.validator.min.js';
module.exports = config;
