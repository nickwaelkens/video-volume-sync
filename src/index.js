import chromeStorage from './chrome-storage';
import debounce from 'lodash.debounce';

let desiredVolume = 0.5;
let allVideos = [...document.getElementsByTagName('video')];

const updateVideos = () => {
  allVideos.forEach(video => {
    video.volume = desiredVolume;
  });
};

const persistVolume = debounce(() => {
  chromeStorage.set({ desiredVolume });
}, 2000);

const handleVolumeChange = event => {
  desiredVolume = event.target.volume;
  updateVideos();

  persistVolume();
};

const observer = new MutationObserver(mutations => {
  const addedVideos = mutations.reduce((accumulator, mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      const videos = [...mutation.addedNodes]
        .filter(({ tagName }) => tagName && tagName.toLowerCase() === 'div')
        .map(node => node.getElementsByTagName('video'))
        .filter(collection => collection.length)
        .flatMap(video => [...video]);

      if (videos.length > 0) {
        accumulator.push(...videos);
      }
    }
    return accumulator;
  }, []);

  if (addedVideos.length) {
    allVideos = [...new Set([...allVideos, ...addedVideos])];

    allVideos.forEach(video => {
      video.volume = desiredVolume;
      video.removeEventListener('volumechange', handleVolumeChange);
      video.addEventListener('volumechange', handleVolumeChange);
    });
  }
});

(async function main() {
  desiredVolume = await chromeStorage.get('desiredVolume') || 0.5;

  updateVideos();
  observer.observe(document, { childList: true, subtree: true });
}());
