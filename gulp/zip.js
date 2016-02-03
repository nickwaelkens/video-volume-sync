import config from './config';
import fs from 'fs';
import zip from 'gulp-zip';

export default (gulp) => {
    gulp.task('zip', ['scripts'], function () {
        const manifest = JSON.parse(fs.readFileSync(`${config.src.root}/manifest.json`, 'utf8')),
            distFileName = `${manifest.name} v${manifest.version}.zip`,
            mapsFileName = `${manifest.name} v${manifest.version}-maps.zip`;

        //collect all source maps
        gulp.src(`${config.dist.root}/**/*.map`)
            .pipe(zip(mapsFileName))
            .pipe(gulp.dest(config.dist.zip));

        //build distributable extension
        return gulp.src([`${config.dist.root}/**/*`, `!${config.dist.root}/**/*.map`])
            .pipe(zip(distFileName))
            .pipe(gulp.dest(config.dist.zip));
    });
};
