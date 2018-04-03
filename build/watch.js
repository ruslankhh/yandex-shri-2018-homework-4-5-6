import { reload } from 'browser-sync';
import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('watch', () => {
  gulp.watch(['.babelrc', 'client/src/**/*.js'], () => {
    runSequence('scripts', reload);
  });
  gulp.watch(['client/src/static/**/*'], () => {
    runSequence('static', reload);
  });
  gulp.watch(['.postcssrc', 'client/src/**/*.post.css'], () => {
    runSequence('styles', reload);
  });
});
