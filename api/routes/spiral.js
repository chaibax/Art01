var express = require('express');
var router = express.Router();

var spiral = require('zero-indexed-ulam-spiral');
// => https://www.npmjs.com/package/zero-indexed-ulam-spiral

router.get('/getLatticeCoordinatesFor/:position',  function (req, res, next) {

    let result = spiral.getLatticeCoordinatesFor(req.params.position);   
    res.send({"x" : result[0], "y" : result[1]});

});

router.get('/getSpiralIndexForCoordinates/:x/:y',  function (req, res, next) {

    let result = spiral.getSpiralIndexForCoordinates([req.params.x,req.params.y]);   
    res.send({"position" : result});
});


module.exports = router;