const get = key => new Promise(resolve => {
  chrome.storage.sync.get(key, items => {
    resolve(items[key]);
  });
});

const set = items => new Promise(resolve => {
  chrome.storage.sync.set(items, resolve);
});

export default { get, set };
