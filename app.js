var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const db = require('./config/db')



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload.route');
const courseRouter = require('./routes/course.route');
const galleryRouter = require('./routes/gallery.route');
const staffRouter = require('./routes/staff.route');
const eventRouter = require('./routes/event.route');
const contactRouter = require('./routes/contact.route');
const newsrouter = require('./routes/notifications.route')





var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', indexRouter);
app.use('/users', usersRouter);
app.use('/uploads', uploadRouter);
app.use('/courses', courseRouter);
app.use('/gallery', galleryRouter);
app.use('/staff', staffRouter);
app.use('/events', eventRouter);
app.use('/contact', contactRouter);
app.use('/news', newsrouter);






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
