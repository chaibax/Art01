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


router.get('/getSquareSize/:position',  function (req, res, next) {

    //renvoi la taille d'un coté du carré dans lequel est inclus un pixel selon sa position/. Ex : pour la position 31, le pixel  
    // a pour position > [2, 3] . Il est inclus dans un carré ayant 7 de coté (3*2)+1

    let result = spiral.getLatticeCoordinatesFor(req.params.position);   
    let size = Math.max(Math.abs(result[0]),Math.abs(result[1]));
    res.send({"square_size" : ((2*size)+1)});

});

module.exports = router;