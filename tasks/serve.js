import browserSync from 'browser-sync';
import gulp from 'gulp';
import nodemon from 'gulp-nodemon';

import config from './../app.json';

let called = false;

gulp.task('nodemon', cb =>
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

gulp.task('browser-sync', ['nodemon'], cb =>
  browserSync(
    {
      notify: false,
      online: false,
      open: false,
      proxy: `http://localhost:${config.port}`,
      reloadDelay: 1000,
      ui: false
    },
    cb
  )
);

gulp.task('serve', ['browser-sync']);
