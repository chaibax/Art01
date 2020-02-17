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
  url: process.env.MONGODB_URI,                        // optional
  eventsCollectionName: 'events',                // optional
  snapshotsCollectionName: 'snapshots',          // optional
  transactionsCollectionName: 'transactions',    // optional
  positionsCollectionName: 'positions'

});

es.init(function (err) {
  es.defineEventMappings({
    id: 'id',
    commitId: 'commitId',
    commitSequence: 'commitSequence',
    commitStamp: 'commitStamp',
    streamRevision: 'streamRevision'
  });


  es.on('connect', function () {
    debug('storage connected');
  });

  es.on('disconnect', function () {
    debug('connection to storage is gone');
  });


  es.getEventStream('pixels', function (err, stream) {
    stream.addEvent({ my: 'event' });
    stream.addEvents([{ my: 'event2' }]);
    stream.commit(function (err, stream) {
      console.log(stream.eventsToDispatch); // this is an array containing all added events in this commit.
    });


  });

});




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);

module.exports = app;


