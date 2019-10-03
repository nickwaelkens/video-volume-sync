import chromeStorage from './chrome-storage';
import debounce from 'lodash.debounce';

let desiredVolume = 0.5;

const updateVideos = () => {
  [...document.getElementsByTagName('video')].forEach(video => {
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

(async function main() {
  desiredVolume = await Number(chromeStorage.get('desiredVolume')) || 0.5;

  updateVideos();
}());
