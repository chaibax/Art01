require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventstore = require('eventstore');
var debug = require('debug')('api');

var app = express();
var es = eventstore();




var es = require('eventstore')({
  type: 'mongodb', // ca marche avec inMemory
  eventsCollectionName: 'events',             // optional
  snapshotsCollectionName: 'snapshots',       // optional
  transactionsCollectionName: 'transactions', // optional
  timeout: 10000,
  url : process.env.MONGODB_URI
});

es.on('connect', function() {
  debug('storage connected');  
  });

  es.on('disconnect', function() {
    debug('connection to storage is gone');
  });

const uuidv1 = require('uuid/v1');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);

module.exports = app;
debug('>>> '+process.env.MONGODB_URI+' Host= '+process.env.MONGO_HOST+'PORT= '+process.env.MONGO_PORT);
debug('toto');







es.getEventStream('streamId', function(err, stream) {
  stream.addEvent({ my: 'event' });
  stream.addEvents([{ my: 'event2' }]);
  stream.commit(function(err, stream) {
  console.log(stream.eventsToDispatch); // this is an array containing all added events in this commit.
  });
  });

  es.init(); // callback is optional

/*
es.getEventStream(666, function(err, stream) {
  stream.addEvent({ new: 'nop' });
  stream.commit();
});*/