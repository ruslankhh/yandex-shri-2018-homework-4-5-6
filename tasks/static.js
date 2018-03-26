import gulp from 'gulp';
import plumber from 'gulp-plumber';

gulp.task('static', () => {
  return gulp.src('src/static/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('public/assets'));
});
