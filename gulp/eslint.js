import config from './config';
import eslint from 'gulp-eslint';

export default (gulp) => {
    gulp.task('eslint', function () {
        return gulp.src(`${config.src.scripts}/**/*.js`)
            .pipe(eslint())
            .pipe(eslint.format());
    });
};
