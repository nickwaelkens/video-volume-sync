  import path from 'path';

const resolvePath = (...args) => path.resolve(path.resolve(__dirname), ...args);
const resolveClientPath = (pathName = '') => resolvePath('src', pathName);

export default (environment = 'development') => {
  const __DEV__ = environment === 'development';
  const APP_ENTRY = [resolveClientPath('index.js')];

  const webpackConfig = {
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

  return webpackConfig;
};
