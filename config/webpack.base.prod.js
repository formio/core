const config = require('./webpack.base');
config.mode = 'production';
config.output.filename = 'formio.base.min.js';
module.exports = config;
