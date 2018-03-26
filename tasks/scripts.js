import gulp from 'gulp';
import webpack from 'webpack-stream';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';

gulp.task('scripts', () => {
  return gulp.src('src/scripts/main.js')
    .pipe(plumber())
    .pipe(webpack())
    .pipe(rename('build.js'))
    .pipe(gulp.dest('public/scripts'));
});
