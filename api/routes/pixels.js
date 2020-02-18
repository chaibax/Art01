var express = require('express');
var router = express.Router();
var auth0 = require('../auth0');
var event = require('../eventstore');
var Promise = require('promise');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log(' GET calling with req.ID=');
  console.log(req.query.pixel);

});

router.post('/add', auth0.checkJwt, function(req, res, next) {


  var pos =  event.addevent([{pixel : req.body.pixel },{email : req.body.email },{auth0Id : req.body.auth0Id }]);
console.log("pos>>>>"+pos);

  res.send('le pixel a bien été ajouté: '+req.body.pixel + req.body.email + req.body.auth0Id);
  console.log(' GET calling with req.pixel=');
  console.log(req.body.pixel);


  
  
});

module.exports = router;
