import path from 'path';
import Promise from 'bluebird';
import fs from './lib/fs';

async function clean() {
  const rimraf = Promise.promisify(require('rimraf'));
  const buildDir = path.join(__dirname, '../build');

  await rimraf(buildDir);
  await fs.makeDir('build');
}

export default clean;
