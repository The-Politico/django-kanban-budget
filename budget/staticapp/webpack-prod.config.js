const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const _ = require('lodash');


module.exports = {
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
  },
  entry: _.zipObject(
    glob.sync('./src/js/main-*.js*').map(f => path.basename(f, path.extname(f))),
    glob.sync('./src/js/main-*.js*')
  ),
  output: {
    path: path.resolve(__dirname, '../static/budget'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['postcss-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['postcss-loader', 'css-loader'],
        }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
    }),
    new ExtractTextPlugin({
      filename:  (getPath) => {
        return getPath('css/[name].css').replace('css/js', 'css');
      },
      allChunks: true,
    }),
    new OptimizeCssAssetsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
