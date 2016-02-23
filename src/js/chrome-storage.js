const get = (keys) => new Promise((resolve, reject) => {
  return chrome
    .storage
    .sync
    .get(keys, (items) => {
      resolve(items);
      const err = chrome.runtime.lastError;
      return (err) ? reject(err) : resolve(items);
    });
});

const set = (items) => new Promise((resolve, reject) => {
  return chrome
    .storage
    .sync
    .set(items, () => {
      const err = chrome.runtime.lastError;
      return (err) ? reject(err) : resolve(items);
    });
});

export default { get, set };
