'use strict';

module.exports = function(_path) {
  return {
    context: _path,
    debug: false,
    devtool: 'cheap-inline-module-source-map',
    output: {
      publicPath: '/',
      filename: '[name].[chunkhash].js'
    },
    devServer: {
      host: '0.0.0.0',
      port: '8080'
    }

  }
}
