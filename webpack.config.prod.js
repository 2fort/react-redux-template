const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const staticFolder = 'static';
const withFavicons = false; // add favicons and change this to true

module.exports = {
  entry: {
    app: ['./src/App.jsx'],
  },

  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: `${staticFolder}/[name].[chunkhash:8].js`,
    chunkFilename: `${staticFolder}/[name].[chunkhash:8].chunk.js`,
  },

  resolve: {
    extensions: ['.jsx', '.js'],
    modules: ['node_modules'],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `${staticFolder}/img/[name]-[hash:10].[ext]`,
            },
          },
        ],
      },
      {
        test: /\.(svg|ttf|woff|woff2|eot|otf)$/,
        include: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `${staticFolder}/fonts/[name].[ext]`,
            },
          },
        ],
      },
    ],
  },

  recordsPath: path.join(__dirname, 'records.json'),

  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Redux template',
      template: './src/index.ejs',
      inject: 'body',
      filename: 'index.html',
      withManifest: withFavicons,
      NODE_ENV: 'production',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new MiniCssExtractPlugin({
      filename: `${staticFolder}/[name].[contenthash].css`,
      chunkFilename: `${staticFolder}/[id].[contenthash].css`,
    }),
    new CopyPlugin({
      patterns: [
        ...(withFavicons ? [{ from: 'src/static/favicons/**/*', to: '[name][ext]' }] : []),
        { from: 'src/static/other/**/*', to: '[name][ext]' },
      ],
    }),
  ],
};
