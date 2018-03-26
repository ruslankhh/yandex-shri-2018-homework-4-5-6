const gulp = require('gulp');
const requireDir = require('require-dir');
const runSequence = require('run-sequence');

requireDir('./tasks', { recurse: true });

gulp.task('default', () => {
  runSequence('build', 'serve', 'watch');
});
