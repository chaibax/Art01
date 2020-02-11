require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI+'/art01events', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);

module.exports = app;
console.log('>>> '+process.env.MONGODB_URI);