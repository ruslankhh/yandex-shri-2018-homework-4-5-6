import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import plumber from 'gulp-plumber';

gulp.task('scripts', () => {
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('build.js'))
    .pipe(gulp.dest('public/scripts'));
});
