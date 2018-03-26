import gulp from 'gulp';
import webpack from 'webpack-stream';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import minify from 'gulp-minify';
import _if from 'gulp-if';

const isProduction = process.env.NODE_ENV === 'production';

gulp.task('scripts', () => {
  return gulp
    .src('src/scripts/main.js')
    .pipe(plumber())
    .pipe(webpack())
    .pipe(_if(isProduction, minify({ noSource: isProduction })))
    .pipe(rename('build.js'))
    .pipe(gulp.dest('public/scripts'));
});
