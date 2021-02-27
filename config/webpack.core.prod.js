const config = require('./webpack.core');
config.mode = 'production';
config.output.filename = 'formio.core.min.js';
module.exports = config;
