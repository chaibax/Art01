var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log(' GET calling with req.ID=');
  console.log(req.query.pixel);

});


/* GET users listing. */
router.get('/add', function(req, res, next) {
  res.send('respond with a resource');
  console.log(' GET calling with req.pixel=');
  console.log(req.query.pixel);

});

module.exports = router;
