require('dotenv').config();
var auth0 = require('./auth0');
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
const helmet = require('helmet')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pixelsRouter = require('./routes/pixels');

require('./eventstore');
 
var app = express();
app.use(cors(corsOptions));

// Define an endpoint that must be called with an access token
app.get("/api/external", auth0.checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated!"
  });
});



// Set up a whitelist and check against it:
var whitelist = ['http://localhost:3000', 'http://localhost', 'https://art0x.herokuapp.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


app.use(logger('dev'));
app.use(helmet());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/users', usersRouter);
app.use('/api/pixels', pixelsRouter);

module.exports = app;


