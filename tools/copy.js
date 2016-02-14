import Promise from 'bluebird';

async function copy() {
  const ncp = Promise.promisify(require('ncp'));

  await Promise.all([
    ncp('src/manifest.json', 'build/manifest.json'),
  ]);
}

export default copy;
