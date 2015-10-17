var path = require('path');
var bower_dir = __dirname + '/bower_components';

var config = {
  entry: ['webpack/hot/dev-server', path.resolve(__dirname, './src/CPSAnalytics/App.jsx')],
  
  devtool: 'eval',

  output: {
    path: path.resolve(__dirname, './dist/CPSAnalytics'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: path.join(__dirname, 'src/CPSAnalytics'),
        loader: 'babel-loader',
        query: {
          optional: ['es7.classProperties','es7.objectRestSpread', 'es7.decorators']
        }
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
    'jquery': 'jQuery',
    'd3': 'd3'
  },

  node: {
    net: 'empty',
    tls: 'empty'
  }
};

module.exports = config;
