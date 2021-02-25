const config = require('./webpack.config');
config.mode = 'production';
config.output.filename = 'formio.core.min.js';
module.exports = config;
