import fs from 'fs';
import gulp from 'gulp';

const tasks = './gulp/';
const blacklist = ['config.js'];

// Get local files
const files = fs.readdirSync(tasks).filter(file => blacklist.indexOf(file) === -1);

// Load and run custom tasks
for (const file of files) {
    require(`${tasks}${file}`).default(gulp);
}
