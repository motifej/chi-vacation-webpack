'use strict';

module.exports = function(_path) {
  return {
    context: _path,
    debug: true,
    devtool: 'eval',
    devServer: {
      contentBase: './dist',
      info: true,
      hot: false,
      inline: true,
      host: '0.0.0.0',
      port: '8090'
    }
  }
};
