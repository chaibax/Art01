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


   
    //addevent({ my: 'event' });

   module.exports.addevent =  async function addevent(event) {

    var pos =  es.getEventStream('pixels', function (err, stream) {

         stream.addEvent(event);
         var res = stream.commit(function (err, stream) {
             console.log(stream.eventsToDispatch); // this is an array containing all added events in this commit.
             var position = stream.eventsToDispatch[0]['position']; // N° de pixel 
             var id_event = stream.eventsToDispatch[0]['id']; // Identidiant de l'event 
             console.log('dans le commit position =' + position)
             return position;

         });
         return res;
     });
     return pos;
 }

});