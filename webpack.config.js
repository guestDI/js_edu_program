const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['./index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    port: 3005,
    inline: true,
    host: 'localhost',
    contentBase: './',
    hot: true,
    watchOptions: {
      poll: true
    }
  },
  devtool: 'source-map',
  module: {
    rules: [{
        test: /\.scss$/,
        exclude: /node-module/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        use: ['raw-loader']
      },
      {
        test: /\.js$/,
        exclude: /node-module/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    // new ExtractTextPlugin('style.css'),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: false
    })
  ]
};