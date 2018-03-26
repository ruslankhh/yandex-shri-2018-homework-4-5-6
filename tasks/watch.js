import { reload } from 'browser-sync';
import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('watch', () => {
  // gulp.watch(['.posthtmlrc', 'src/**/*.post.html'], () => {
  //   runSequence('markup', reload);
  // });
  gulp.watch(['.babelrc', 'src/**/*.js'], () => {
    runSequence('scripts', reload);
  });
  gulp.watch(['src/static/**/*'], () => {
    runSequence('static', reload);
  });
  gulp.watch(['.postcssrc', 'src/**/*.post.css'], () => {
    runSequence('styles', reload);
  });
});
