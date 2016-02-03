import runSequence from 'run-sequence';

export default (gulp) => {
    runSequence.use(gulp);

    gulp.task('default', () => {
        runSequence('clean', ['zip']);
    });
};
