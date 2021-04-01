const config = require('./webpack.form');
config.mode = 'production';
config.output.filename = 'formio.form.min.js';
module.exports = config;
