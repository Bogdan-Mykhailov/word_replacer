const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    content: './src/content.ts',
  },
  devtool: 'inline-source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new HTMLPlugin({
      template: "./src/index.html"
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('manifest.json'),
          to: path.resolve('dist')
        },
        {
          from: path.resolve('./src/style.css'),
          to: path.resolve('dist')
        },
        {
          from: path.resolve('./src/icons'),
          to: path.resolve('dist/icons')
        },
      ]
    })
  ]
};
