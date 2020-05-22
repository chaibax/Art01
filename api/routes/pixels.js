var express = require('express');
var router = express.Router();
var auth1 = require('../auth0');
var eventstore = require('eventstore');
var debug = require('debug')('api');
var image = require('./images');
var ulam = require('../utils/ulam');



//pour pourvoir maj la metadata auth0  de l'user avec le numero de pixel 
var ManagementClient = require('auth0').ManagementClient;

var auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
});

const mongoose = require('mongoose'), Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
var Events = mongoose.model('Events', new Schema(), 'events');

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
});

es.on('connect', function () {
  console.log('storage connected');
});

es.on('disconnect', function () {
  console.log('connection to storage is gone');
});



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
  debug(' GET calling with req.ID=');
  debug(req.query.pixel);

});

/* GET last pixel added. */
router.all('/last', function (req, res, next) {
  es.getLastEvent('pixels', function (err, evt) {
    evt_to_send = { "position": evt.position, "commitStamp": evt.commitStamp, "eventId": evt.id, "pixel": evt.payload[0].pixel };
    res.send(evt_to_send);
  });
});

/* GET  image size */
router.all('/squaresize', function (req, res, next) {
  es.getLastEvent('pixels', function (err, evt) { 
    if (evt) {
      let size = ulam.getSquareSize(evt.position);
      evt_to_send = { "squaresize": size };
      res.send(evt_to_send);
      //console.log(es.store);
    } else {
      res.send({ "square": 0 });
    }
  });
});

router.all('/squaresize', function (req, res, next) {
  es.getLastEvent('pixels', function (err, evt) {
    if (evt) {
      evt_to_send = { "count": evt.position };
      res.send(evt_to_send);
      //console.log(es.store);
    } else {
      res.send({ "count": 0 });
    }
  });
});

router.post('/add', auth1.checkJwt, function (req, res, next) {
  var io = req.app.get('socketio');
  let event = [{ pixel: req.body.pixel }, { email: req.body.email }, { auth0Id: req.body.auth0Id }, {given_name : req.body.given_name}, {picture_large : req.body.picture_large}];
  Events.countDocuments({ 'payload.email': req.body.email }, function (err, count) {
    if ((count > 0) && !(process.env.DEBUG_MODE == '1')) {
      //console.log('il exsite deja ' + count + ' pixel avec cet email');
      res.send('le pixel a DEJA été ajouté par : ' + req.body.email);
    } else {
      //console.log('il exsite ' + count + ' pixel avec cet email et  debug_mode= ' + process.env.DEBUG_MODE);      
      es.getEventStream('pixels', function (err, stream) {
        //verification que l'user n'a pas déjà deposé un pixel dans le store. Si non : 
        stream.addEvent(event);
        stream.commit(function (err, stream) {
          var position_added = stream.eventsToDispatch[0]['position'] - 1; // N° de pixel     
          //var id_event = stream.eventsToDispatch[0]['id']; // Identidiant de l'event 
          //res.send('le pixel a bien été ajouté: ' + req.body.pixel + req.body.email + req.body.auth0Id + ' a la position :' + position);
          //il faut générer l'image ici : 
          let datatoadd = stream.eventsToDispatch[0]['payload'];

          let usercolor = datatoadd[0].pixel;
          const color = usercolor.split('.');
          const red = color[0];
          const green = color[1];
          const blue = color[2];
          const opacity = Math.round((color[3] / 255) * 100); // a voir ce qui est attendu 
          //:position/:r/:g/:b/:alpha
          let pixelparams = { position: position_added, r: red, g: green, b: blue, alpha: opacity };
          
          image.generateimage(pixelparams, function (res1) {
       
            console.log('🌈 génération de image ok avec resulta = ' + res1);

            if( !res1 ) {
              //soucis avec la génération de l'image. Il faudrait : soit ne pas enregistrer le pixel, soit créer un event d'erreur?
            }
            io.emit('newpixel', { 'newpixel' : pixelparams, 'given_name' : req.body.given_name, 'picture' : req.body.picture_large, 'date' : stream.eventsToDispatch[0]['commitStamp'] });
            res.send({ 'position': position_added });
          });
          //enregistrer la position dans les metadata Auth0 de l'user 
          //  console.log(users[0]);
          //console.log(users[0].user_id);
          var params = { id: req.body.auth0Id };
          var metadata = {
            pixel_added: 1,
            pixel_position: position_added
          };
          auth0.updateUserMetadata(params, metadata, function (err, user) {
            if (err) {
              // Handle error.
            }
            // Updated user.
          });
        });
      //end commit 




      });
    }
  });
});

module.exports = router;
