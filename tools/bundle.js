/* eslint-disable no-console */

import webpack from 'webpack';
import webpackConfig from './webpack.config';


const bundle = () => {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => { // eslint-disable-line consistent-return
      if (err) {
        return reject(err);
      }
      console.log(stats.toString(webpackConfig.stats));
      resolve();
    });
  });
}

export default bundle;
