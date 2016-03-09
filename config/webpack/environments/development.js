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
      inline: true
    }
  }
};
