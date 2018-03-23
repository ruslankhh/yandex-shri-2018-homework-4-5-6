'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');

const config = require('./app.json');

let called = false;

gulp.task('nodemon', (cb) =>
  nodemon({
    script: './server/index.js'
  })
    .on('start', () => {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', () => {
      browserSync.reload({ stream: false });
    })
);

gulp.task('browser-sync', (cb) =>
  browserSync({
    notify: false,
    online: false,
    open: false,
    proxy: `http://localhost:${config.port}`,
    reloadDelay: 500,
    ui: false
  }, cb)
);

gulp.task('default', gulp.series('nodemon', 'browser-sync'));
