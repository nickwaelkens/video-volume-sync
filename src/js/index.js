import * as debounce from 'lodash/debounce';

const DEFAULT_VOLUME = 0.5;
const videos = [];

// create an observer instance
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            [...mutation.addedNodes].forEach((addedNode) => {
                if (addedNode.tagName && addedNode.tagName.toLowerCase() === 'div') {
                    const addedVideo = addedNode.querySelector('video');
                    if (addedVideo) videos.push(addedVideo);
                }
            });
        }
    });
});

const handleVolume = (video) => {
    chrome.storage.sync.get('volume', (items) => {
        if (items.volume) {
            video.volume = items.volume;
        } else {
            video.volume = DEFAULT_VOLUME;
            chrome.storage.sync.set({volume: DEFAULT_VOLUME});
        }
    });
    video.onvolumechange = debounce(() => {
        console.log('change volume plz');
        //chrome.storage.sync.set({volume: video.volume});
    }, 1000);
};

// pass in the target node, as well as the observer options
observer.observe(document, {childList: true, subtree: true});

// Handle volume for loaded videos
[...document.querySelectorAll('video')].forEach((existingVideo) => handleVolume(existingVideo));
// Make sure new videos get same treatment
Array.observe(videos, (changes) => {
    changes[0].object.forEach((addedVideo) => handleVolume(addedVideo));
});
