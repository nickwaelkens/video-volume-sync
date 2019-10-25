import chromeStorage from './chrome-storage';
import debounce from 'lodash.debounce';

let desiredVolume = 0.5;
let videos:Array<HTMLVideoElement> = [];

const updateVideos = () => {
  videos.forEach(video => {
    video.volume = desiredVolume;
  });
};

const persistVolume = debounce(() => {
  chromeStorage.set({ desiredVolume });
}, 2000);

document.addEventListener('volumechange', event => {
  if (event.target instanceof HTMLVideoElement) {
    desiredVolume = event.target.volume;

    updateVideos();
    persistVolume();
  }
}, true);

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      for (const node of mutation.addedNodes) {
        // Only track elements, skip other nodes (e.g. text nodes)
        if (!(node instanceof HTMLElement)) continue;

        for (const video of node.getElementsByTagName('video')) {
          video.muted = desiredVolume === 0;
          video.volume = desiredVolume;
          videos = [...new Set([...videos, video])];
        }
      }
    }
  });
});

(async function main() {
  desiredVolume = await Number(chromeStorage.get('desiredVolume')) || 0.5;
  observer.observe(document, { childList: true, subtree: true });

  videos = [...document.getElementsByTagName('video')];
  updateVideos();
}());
