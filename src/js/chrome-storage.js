const get = (keys) => {
  const promise = new Promise((resolve, reject) => {
    chrome
      .storage
      .sync
      .get(keys, (items) => {
        resolve(items);
        const err = chrome.runtime.lastError;
        return (err) ? reject(err) : resolve(items);
      });
  });
  return promise;
};

const set = (items) => {
  const promise = new Promise((resolve, reject) => {
    chrome
      .storage
      .sync
      .set(items, () => {
        const err = chrome.runtime.lastError;
        return (err) ? reject(err) : resolve(items);
      });
  });
  return promise;
};

export { get, set };
