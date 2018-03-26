import gulp from 'gulp';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';

gulp.task('styles', () => {
  return gulp.src('src/styles/styles.post.css')
    .pipe(plumber())
    .pipe(postcss())
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('public/styles'));
});
