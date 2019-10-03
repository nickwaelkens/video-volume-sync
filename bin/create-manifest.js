const fs = require('fs');
const path = require('path');
const resolvePath = (...args) => path.resolve(path.resolve(__dirname), ...args);

const {description, version} = require(resolvePath('..', 'package.json'));
const __DEV__ = process.env.NODE_ENV === 'development';
const manifestPath = resolvePath('..', 'dist', 'manifest.json');

const manifest = {
    manifest_version: 2,
    name: 'Video Volume Sync',
    version,
    description,
    icons: {
        48: 'icons/icon-48.png',
        128: 'icons/icon-128.png',
    },
    permissions: ['storage'],
    content_scripts: [{
        matches: ['*://*.facebook.com/*'],
        js: [
            'manifest.js',
            __DEV__ ? 'vendors.js' : null,
            'app.js',
        ].filter(Boolean),
    }]
};

fs.writeFileSync(manifestPath ,JSON.stringify(manifest, null, 2));