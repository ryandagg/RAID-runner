const webpack = require('webpack');
const path = require('path');


const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv)
    }
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      tslint: {
        emitErrors: false,
        failOnHint: false,
      }
    }
  }),
];

var config = {
  devtool: isProd ? 'hidden-source-map' : 'source-map',
  context: path.resolve('./src'),
  entry: {
    app: './index.ts'
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: [/\/node_modules\//],
        use: ['awesome-typescript-loader', 'source-map-loader']
      },
      !isProd
        ? {
            test: /\.(js|ts)$/,
            loader: 'istanbul-instrumenter-loader',
            exclude: [/\/node_modules\//],
            query: {
              esModules: true
            }
          }
        : null,
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.css$/, loaders: ['style-loader', 'css-loader'] }
    ].filter(Boolean)
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src/'),
    },
  },
  plugins: plugins,
  devServer: {
    contentBase: path.join(__dirname, 'dist/'),
    compress: true,
    port: 6000,
    hot: true
  }
};

module.exports = config;
