const config = require('./webpack.config');
config.mode = 'production';
config.entry = {
  'formio.core.min.js': './lib/index.js',
  'formio.min.js': './lib/sdk/index.js',
  'formio.utils.min.js': './lib/utils/index.js',
};
module.exports = config;
