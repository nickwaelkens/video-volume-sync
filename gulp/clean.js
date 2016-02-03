import config from './config';
import del from 'del';

export default (gulp) => {
    gulp.task('clean', function () {
        return del(`${config.dist.root}/**/*`);
    });
};
