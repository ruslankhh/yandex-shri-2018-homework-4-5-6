const gulp = require('gulp');
const requireDir = require('require-dir');
const runSequence = require('run-sequence');

requireDir('./build', { recurse: true });

gulp.task('default', () => {
  runSequence('build', 'serve', 'watch');
});
