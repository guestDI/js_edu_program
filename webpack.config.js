const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    port: 3005,
    inline: true,
    host: "localhost",
    contentBase: './',
    hot: true,
    watchOptions: {
      poll: true
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      }
    ]
  },
  plugins: [
    // new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
            template: "./index.html"
        })
  ]
};
