import gulp from 'gulp';
import posthtml from 'gulp-posthtml';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';

gulp.task('markup', () => {
  return gulp.src('src/pages/**/*.post.html')
    .pipe(plumber())
    .pipe(posthtml())
    .pipe(rename(path => {
      path.basename = path.basename.replace('.post', '');
    }))
    .pipe(gulp.dest('public'));
});
