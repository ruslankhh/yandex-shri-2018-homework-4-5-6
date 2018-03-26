import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('build', ['clean'], (cb) => {
  runSequence([
    'scripts',
    'static',
    'styles'
  ], cb);
});
