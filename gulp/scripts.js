import config from './config';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';

export default (gulp) => {
    gulp.task('scripts', ['eslint'], function () {
        return gulp.src(`${config.src.scripts}/**/*.js`)
            .pipe(sourcemaps.init())
            .pipe(babel({presets: ['es2015']}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.dist.scripts));
    });
};
