var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const mongoose = require('mongoose');
const ProductTransaction = require('./models/productTransaction.model');
const axios = require('axios'); // Using axios for HTTP requests
const moment = require('moment');
const barChartRouter = require('./routes/barChart');
const pieChartRouter = require('./routes/pieChart');
const fetchAndStoreData=require('./routes/fetch-and-store-data');
const transactions=require('./routes/transactions');
const statistics = require('./routes/statistics');

mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/api', fetchAndStoreData);
app.use('/api',transactions);
app.use('/api',statistics);
app.use('/api', barChartRouter);
app.use('/api', pieChartRouter);

app.get('/', (req, res) => {
  // Pass data to the template (optional)
  const name = 'John Doe';

  res.render('home', { name }); // Pass data as an object
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
