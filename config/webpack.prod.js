const path = require('path');
const config = require('./webpack.config');
config.mode = 'production';
config.entry = {
  'formio.core.min.js': './src/index.ts',
  'formio.base.min.js': './src/base/index.ts',
  'formio.components.min.js': './src/components/index.ts',
  'formio.model.min.js': './src/model/index.ts',
  'formio.modules.min.js': './src/modules/index.ts',
  'formio.min.js': './src/sdk/index.ts',
  'formio.utils.min.js': './src/utils/index.ts',
};
module.exports = config;
