/**
 * Facebook Video Volume Sync
 * This extension remembers and synchronises your volume for videos on Facebook.
 *
 * @version   0.0.2
 * @author    Nick Waelkens <hello@nickwaelkens.be>
 * @date      2016
 */

import debounce from 'lodash/debounce';
import forEach from 'lodash/forEach';
import * as chromeStorage from './chrome-storage';

/**
 * Set a sensible default volume so headphone users don't go deaf
 * @type {number}
 */
const DEFAULT_VOLUME = 0.5;

/**
 * The desired volume for the videos on the current page
 * @type {number}
 */
let desiredVolume = DEFAULT_VOLUME;

/**
 * Scrape for every existing `<video>` element on a Facebook page
 * @see http://jsperf.com/queryselectorall-vs-getelementsbytagname
 * @type {Array}
 */
const videos = document.getElementsByTagName('video');

/**
 * Write to local storage only once every two seconds (MAX_WRITE_OPERATIONS_PER_HOUR)
 * @see https://developer.chrome.com/extensions/storage#property-sync
 */
const persistVolume = debounce(() => {
  chromeStorage.set({ fbvvs: desiredVolume });
}, 2000);

/**
 * Handler for when the user changes volume of a video
 * @param event
 */
const onVolumeChange = (event) => {
  desiredVolume = event.target.volume;
  forEach(videos, (video) => handleVideo(video)); // eslint-disable-line no-use-before-define

  // Write the new desired volume to the local storage for future sessions
  if (desiredVolume !== DEFAULT_VOLUME) persistVolume();
};

/**
 * Handler for when a new video is found on the page
 * @param video
 */
const handleVideo = (video) => {
  video.volume = desiredVolume;
  video.removeEventListener('volumechange', onVolumeChange);
  video.addEventListener('volumechange', onVolumeChange);
};

/**
 * Main mutation observer instance, will check if new `<video>` elements are added when scrolling
 * through Facebook's feed
 * @type {MutationObserver}
 */
const observer = new MutationObserver(mutations => {
  forEach(mutations, (mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      forEach(mutation.addedNodes, (addedNode) => {
        if (addedNode.tagName && addedNode.tagName.toLowerCase() === 'div') {
          const addedVideos = addedNode.getElementsByTagName('video');
          forEach(addedVideos, (addedVideo) => handleVideo(addedVideo));
        }
      });
    }
  });
});

/**
 * Pass in the target node, as well as the observer options
 */
observer.observe(document, { childList: true, subtree: true });

/**
 * Check local storage if we have a desired volume set from previous sessions/other devices
 * If not, just use the `DEFAULT_VOLUME` value and set it for every video instance
 */
chromeStorage.get('fbvvs').then(({ fbvvs = DEFAULT_VOLUME }) => {
  desiredVolume = fbvvs;
  forEach(videos, (video) => handleVideo(video));
});
