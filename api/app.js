require('dotenv').config();
var auth0 = require('./auth0');
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
const helmet = require('helmet');
const scout = require("@scout_apm/scout-apm");
const process = require("process");
var cookieParser = require('cookie-parser');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pixelsRouter = require('./routes/pixels');
var spiralRouter = require('./routes/spiral');
var imagesRouter = require('./routes/images');
const port = process.env.PORT || 3001;


scout.install(
  {
    allowShutdown: true, // allow shutting down spawned scout-agent processes from this program
    monitor: true, // enable monitoring
    name: "Art01",
    key: "kqdsVi5KDduqNOkRdV5Q",
  },
);

var app = require('express')();
app.use(scout.expressMiddleware());

var http = require('http').createServer(app);
var io = require('socket.io')(http);



/*
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
    server.listen(3002, () => {
  console.log(`Server started: http://localhost:3001`)
})
*/

/*
var app = express();
var server = require('http').Server(app);
server.listen(3002);
var io = require('socket.io')(server);
*/
// Set up a whitelist and check against it:
/*
var whitelist = ['http://localhost:3000', 'http://localhost', 'https://art0x.herokuapp.com', 'https://art0x.eu.auth0.com/']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error(origin+'Not allowed by CORS :('))
    }
  }
}*/


//app.use(cors(corsOptions));

app.use(cors());


// Define an endpoint that must be called with an access token
app.get("/api/external", auth0.checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated!"
  });
});


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



io.on('connection', (socket) => {
  //console.log('a user connected');
});

http.listen(port, () => {
  console.log('listening on '+port);
});

//app.use(scout.expressMiddleware());
//fait planter /pixels/add avec un pending infini


app.set('socketio', io);

// Shut down the core-agent when this program exits
process.on('exit', () => {
  if (app && app.scout) {
    app.scout.shutdown();
  }
});

module.exports = app;


