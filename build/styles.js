import gulp from 'gulp';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import minify from 'gulp-clean-css';
import _if from 'gulp-if';

const isProduction = process.env.NODE_ENV === 'production';

gulp.task('styles', () => {
  return gulp
    .src('client/src/styles/styles.post.css')
    .pipe(plumber())
    .pipe(postcss())
    .pipe(_if(isProduction, minify()))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('public/styles'));
});
