const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = { ...require('./../config.json'), ...require('./data/data.json') };
const indexRouter = require('./routes/index');
const treeRouter = require('./routes/tree');
const blobRouter = require('./routes/blob');
const commitsRouter = require('./routes/commits');
const branchesRouter = require('./routes/branches');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
console.log(path.join(__dirname, '../public'));

app.locals = {
  config,
  title: '',
  links: config.menu || [],
  body: '',
  error: false,
  nav: { branches: true, breadcrumbs: true }
};

app.use('/', indexRouter);
app.use('/tree', treeRouter);
app.use('/blob', blobRouter);
app.use('/commits', commitsRouter);
app.use('/branches', branchesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.title = err.message;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
