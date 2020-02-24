var express = require('express');
var router = express.Router();
var auth0 = require('../auth0');
var eventstore = require('eventstore');
var debug = require('debug')('api');


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
  });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log(' GET calling with req.ID=');
  console.log(req.query.pixel);

});

/* GET last pixel added. */
router.all('/last', function(req, res, next) {
  es.getLastEvent('pixels', function(err, evt) {
    evt_to_send = {"position" : evt.position, "commitStamp" : evt.commitStamp, "eventId" : evt.id , "pixel": evt.payload[0].pixel};
    res.send(evt_to_send );
  });
});

/* GET count pixels. */
router.all('/count', function(req, res, next) {
  es.getLastEvent('pixels', function(err, evt) {
    evt_to_send = {"count" : evt.position};
    res.send(evt_to_send );
  });
});


router.post('/add', auth0.checkJwt, function(req, res, next) {

  let event = [{pixel : req.body.pixel },{email : req.body.email },{auth0Id : req.body.auth0Id }];
console.log('dans /add avec event = ');
console.log(event);
    es.getEventStream('pixels', function (err, stream) {
         //verification que l'user n'a pas déjà deposé un pixel dans le store. Si non : 
         stream.addEvent(event);
         stream.commit(function (err, stream) {
             console.log(stream.eventsToDispatch); // this is an array containing all added events in this commit.
             var position = stream.eventsToDispatch[0]['position']; // N° de pixel 
             var id_event = stream.eventsToDispatch[0]['id']; // Identidiant de l'event 
             console.log('dans le commit position =' + position);
             res.send('le pixel a bien été ajouté: '+req.body.pixel + req.body.email + req.body.auth0Id+' a la position :'+position);     
             //enregistrer la position dans les metadata Auth0 de l'user 
         });
     });
});

module.exports = router;
