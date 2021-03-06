var auth1 = require('../auth0');
var eventstore = require('eventstore');
var image = require('./images');
var ulam = require('../utils/ulam');
var express = require('express');
var router = express.Router();
const twitter = require('twitter-lite');
const client = new twitter({  
  consumer_key: process.env.TWITTER_CONSUMER_KEY ,  
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,  
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,  
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET  
});


//pour pourvoir maj la metadata auth0  de l'user avec le numero de pixel 
var ManagementClient = require('auth0').ManagementClient;
var auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
});

const mongoose = require('mongoose'), Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function(err, db) {
  if (err) {
      console.log('Unable to connect to the server. Please start the server. Error:', err);
  } else {
      console.log('Connected to Server successfully! '+process.env.MONGODB_URI);
  } 
});


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
    const color = evt.payload[0].pixel.split('.');  
    const red = color[0];
    const green = color[1];
    const blue = color[2];
    const opacity = (color[3]/255 * 100) / 100;
    evt_to_send = { "position": evt.position, "commitStamp": evt.commitStamp, "r": color[0],"g": color[1],"b": color[2],"alpha": opacity, "name" : evt.payload[3].given_name, "avatar" : evt.payload[4].picture_large };
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

router.all('/count', function (req, res, next) {
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
  console.log('pixels/add');
  console.log(req.body);

  var io = req.app.get('socketio');
  let event = [{ pixel: req.body.pixel }, { email: req.body.email }, { auth0Id: req.body.auth0Id }, {given_name : req.body.given_name}, {picture_large : req.body.picture_large}];
  Events.countDocuments({ 'payload.email': req.body.email }, function (err, count) {
    if ((count > 0) && !(process.env.DEBUG_MODE == '1')) {
      console.log('il exsite deja ' + count + ' pixel avec cet email');
      res.send('le pixel a DEJA été ajouté par : ' + req.body.email);
    } else {
      console.log('il exsite ' + count + ' pixel avec cet email et  debug_mode= ' + process.env.DEBUG_MODE);      
      es.getEventStream('pixels', function (err, stream) {
        //verification que l'user n'a pas déjà deposé un pixel dans le store. Si non : 
        stream.addEvent(event);
        stream.commit(function (err, stream) {
          var position_added = stream.eventsToDispatch[0]['position'] - 1; // N° de pixel     
          //var id_event = stream.eventsToDispatch[0]['id']; // Identidiant de l'event 
          //res.send('le pixel a bien été ajouté: ' + req.body.pixel + req.body.email + req.body.auth0Id + ' a la position :' + position);
          //il faut générer l'image ici : 
          console.log('tream.addEvent(event)');
          let datatoadd = stream.eventsToDispatch[0]['payload'];

          let usercolor = datatoadd[0].pixel;
          const color = usercolor.split('.');
          const red = color[0];
          const green = color[1];
          const blue = color[2];
          const opacity = Math.round((color[3] / 255) * 100); // a voir ce qui est attendu 
          //:position/:r/:g/:b/:alpha
          let pixelparams = { position: position_added, r: red, g: green, b: blue, alpha: opacity };
          
          // Je n'ai plus besoin de générer une image
         image.generateimage(pixelparams, function (res1) {
       
            console.log('🌈 génération de image ok avec resulta = ' + res1);

            if( !res1 ) {
              //soucis avec la génération de l'image. Il faudrait : soit ne pas enregistrer le pixel, soit créer un event d'erreur?
            }
            //io.emit('newpixel', { 'newpixel' : pixelparams, 'given_name' : req.body.given_name, 'picture' : req.body.picture_large, 'date' : stream.eventsToDispatch[0]['commitStamp'] });
            //res.send({ 'position': position_added });
          });
       
          io.emit('newpixel', { 'newpixel' : pixelparams, 'given_name' : req.body.given_name, 'picture' : req.body.picture_large, 'date' : stream.eventsToDispatch[0]['commitStamp'] });
          res.send({ 'position': position_added });
          if(!(process.env.DEBUG_MODE == '1')){
          var newstatus = req.body.given_name + ' become participant number '+ eval(position_added+1) + ' in a billion  #generativeArt #ParticipatoryArt #PxielArt  #Art Participate 👉 https://1000000000.art ';
          client.post('statuses/update', { status: newstatus }).then(result => {
            console.log('You successfully tweeted this : "' + result.text + '"');
            //res.send('You successfully tweeted this : "' + result.text + '"')
          }).catch(console.error);
        }

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
              console.log('MAJ updateUserMetadata')
              console.log(err);
            }
            // Updated user.
            console.log('maj updateUserMetadata OK ')
          //  console.log(user);
          });
        });
      //end commit 




      });
    }
  });
});

module.exports = router;
