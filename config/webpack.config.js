const path = require('path');
const _ = require('@formio/lodash');
module.exports = (config) => {
    return _.merge({
        mode: 'development',
        output: {
          libraryTarget: 'umd',
          path: path.resolve(__dirname, '../dist'),
          environment: {
            arrowFunction: false
          },
        },
        resolve: {
          extensions: ['.ts', '.js'],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: /\.spec\.ts$/,
              loader: "ts-loader"
            }
          ]
        }
    }, config);
};