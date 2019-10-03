import path from 'path';

const resolvePath = (...args) => path.resolve(path.resolve(__dirname), ...args);
const resolveClientPath = (pathName = '') => resolvePath('src', pathName);
const APP_ENTRY = resolveClientPath('index.js');

const __DEV__ = process.env.NODE_ENV === 'development';

export default {
  entry: {
    app: APP_ENTRY,
  },
  output: {
    filename: '[name].js',
    path: resolvePath('dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [resolveClientPath()],
        use: ['babel-loader'],
      },
    ],
  },
  devtool: __DEV__ ? 'inline-source-map' : false,
  optimization: {
    namedModules: __DEV__,
    splitChunks: {
      cacheGroups: {
        appVendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: chunk => chunk.name === 'app',
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },
};
