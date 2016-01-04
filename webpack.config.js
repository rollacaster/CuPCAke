var path = require('path');
var webpack = require('webpack');

var config = {
  entry: [
    path.resolve(__dirname, './src/CPSAnalytics/App.jsx')
  ],

  devtool: 'eval',

  output: {
    path: path.resolve(__dirname, './dist/CPSAnalytics'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: path.join(__dirname, 'src/CPSAnalytics'),
        loaders: ['babel-loader']
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.png']
  },

  externals: {
    jquery: 'jQuery',
    d3: 'd3'
  },

  node: {
    net: 'empty',
    tls: 'empty'
  }
};

module.exports = config;
