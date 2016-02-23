import head from 'lodash/head';
import debounce from 'lodash/debounce';

import * as chromeStorage from './chrome-storage';

const VOLUME_STORAGE = 'fbVolume';
const DEFAULT_VOLUME = 0.5;
const videos = [];

// create an observer instance
const observer = new MutationObserver(mutations => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      [...mutation.addedNodes].forEach(addedNode => {
        if (addedNode.tagName && addedNode.tagName.toLowerCase() === 'div') {
          const addedVideo = addedNode.querySelector('video');
          if (addedVideo) videos.push(addedVideo);
        }
      });
    }
  });
});

const handleVolume = (video) => {
  const _video = video;

  chromeStorage.get(VOLUME_STORAGE).then((items) => {
    if (items[VOLUME_STORAGE]) {
      _video.volume = items[VOLUME_STORAGE];
    } else {
      _video.volume = DEFAULT_VOLUME;
      chromeStorage.set({ [VOLUME_STORAGE]: DEFAULT_VOLUME });
    }
  });

  _video.onvolumechange = debounce(() => {
    chromeStorage.set({ [VOLUME_STORAGE]: _video.volume });
  }, 1000);
};

// pass in the target node, as well as the observer options
observer.observe(document, { childList: true, subtree: true });

// Handle volume for loaded videos
[...document.querySelectorAll('video')].forEach(existingVideo => handleVolume(existingVideo));

// Make sure new videos get same treatment
Array.observe(videos, (changes) => {
  head(changes).object.forEach(addedVideo => handleVolume(addedVideo));
});
