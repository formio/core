const path = require('path');
const config = require('./webpack.config');
config.mode = 'production';
config.entry = {'formio.full.min.js': './src/core.ts'};
config.output.library.name = 'Formio';
config.output.library.export = 'Formio';
module.exports = config;