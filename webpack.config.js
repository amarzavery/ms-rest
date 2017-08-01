const webpack = require('webpack');
//var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './lib/msRest.ts',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: __dirname,
    libraryTarget: 'var',
    library: 'className'
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /(node_modules|test)/,
        options: {
          configFileName: './tsconfig.browser.json'
        }
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  node: {
    fs: false,
    net: false,
    //process: false,
    path: false,
    dns: false,
    tls: false,
    tty: false,
    v8: false,
    Buffer: false
  }
};