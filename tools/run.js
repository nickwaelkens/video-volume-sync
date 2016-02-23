/* eslint-disable no-console */
const run = (fn, options) => {
  const time = require('./lib/time').default;
  const task = typeof fn.default === 'undefined' ? fn : fn.default;
  const start = new Date();
  console.log(`[${time.format(start)}] Starting "${task.name}"`);
  return task(options).then(() => {
    const end = new Date();
    const duration = end.getTime() - start.getTime();
    console.log(`[${time.format(end)}] Finished "${task.name}" after ${duration}ms`);
  });
};

if (process.mainModule.children.length === 0 && process.argv.length > 2) {
  delete require.cache[__filename];
  const module = require(`./${process.argv[2]}.js`).default;
  run(module).catch(err => console.error(err.stack));
}

export default run;
