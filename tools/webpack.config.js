import path from 'path';
import webpack from 'webpack';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

const config = {
  entry: './src/js/index.js',

  output: {
    path    : path.join(__dirname, '../build'),
    filename: 'index.bundle.js',
  },

  stats: {
    colors      : true,
    reasons     : DEBUG,
    hash        : VERBOSE,
    version     : VERBOSE,
    timings     : true,
    chunks      : VERBOSE,
    chunkModules: VERBOSE,
    cached      : VERBOSE,
    cachedAssets: VERBOSE,
  },

  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,

  resolve: {
    extensions: ['', '.js', '.json'],
  },

  plugins: DEBUG ? [] : [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
      },
    }),
  ],

  module: {
    loaders: [
      {
        test   : /\.js$/,
        loader : 'babel-loader',
        include: [
          path.resolve(__dirname, '../src/js'),
        ],
        query  : {
          presets: ['es2015', 'stage-0'],
        },
      },
    ],
  },
};

export default config;
