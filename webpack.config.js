const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = 3050;
const BASE_URL = `http://localhost:${port}`;

const config = {
  entry: {
    app: [
      './src/App.jsx',
      `webpack-dev-server/client?http://localhost:${port}`,
      'webpack/hot/only-dev-server',
    ],
  },

  output: {
    path: '/build',
    publicPath: '/',
    filename: 'js/[hash].[name].js',
  },

  resolve: {
    extensions: ['.jsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
              name: 'img/[name]-[hash:10].[ext]',
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
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Redux template',
      template: './src/index.ejs',
      chunks: ['dev', 'app'],
      inject: 'body',
      filename: 'index.html',
      baseurl: BASE_URL,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  performance: { hints: false },
  devtool: 'source-map',

  devServer: {
    hot: true,
    contentBase: '/build',
    publicPath: '/',
    historyApiFallback: true,
    stats: 'minimal',
    port,
    proxy: {
      // '/web': {
      //  target: '',
      //  changeOrigin: false,
      //  secure: false,
      //  logLevel: 'debug',
      // },
    },
  },
};

module.exports = config;
