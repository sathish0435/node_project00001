var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bookroute = require('./routes/book');
const loginroute = require('./routes/login');
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const exphbs = require('express3-handlebars')
var bodyParser = require('body-parser')

app.engine('hbs', exphbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs'); // Corrected view engine setup

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', indexRouter);
app.use('/book', bookroute);

app.use('/', loginroute);

require('dotenv').config();
  
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Example query
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('Database connected:', res.rows);
  }
});


// No need to set up express.static again here

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

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
