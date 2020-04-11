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
var spiralRouter = require('./routes/spiral');
var imagesRouter = require('./routes/images');
var debug = require('debug');


 
var app = express();



app.use(cors());

// Define an endpoint that must be called with an access token
app.get("/api/external", auth0.checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated!"
  });
});





app.use(logger('dev'));
app.use(helmet());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));



console.log('>>W'+path.join(__dirname, 'public'));
app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/pixels', pixelsRouter);
app.use('/api/spiral', spiralRouter);
app.use('/api/images', imagesRouter.router);

module.exports = app;


