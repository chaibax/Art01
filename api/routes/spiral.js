var express = require('express');
var router = express.Router();

var spiral = require('zero-indexed-ulam-spiral');
// => https://www.npmjs.com/package/zero-indexed-ulam-spiral


var spiralf= require('../utils/ulam');


router.get('/getLatticeCoordinatesFor/:position',  function (req, res, next) {

    //retourne, en donnant des coordonnés x,y, la position, dans le sens numero de pixel (ex : pixel 129). Refentiel : 0,0 au centre 
    let result = spiralf.getLatticeCoordinatesFor(req.params.position)
   // spiral.getLatticeCoordinatesFor(req.params.position);   

    res.send({"x" : result[0], "y" : result[1]});

});

router.get('/getSpiralIndexForCoordinates/:x/:y',  function (req, res, next) {

    //retourne la position, dans le sens numero de pixel (ex : pixel 129), en partant des coordonnés x,y. Refentiel : 0,0 au centre 
    //let result = spiral.getSpiralIndexForCoordinates([req.params.x,req.params.y]);   
    let result = spiralf.getSpiralIndexForCoordinates([req.params.x,req.params.y]);   
    res.send({"position" : result});
});


router.get('/getNewLatticeCoordinatesFor/:position',  function (req, res, next) {
    //Obtenir les cooronnées d'un pixel avec une orginie 0,0 en haut a gauche plustot qu'au centre du carré. Refentiel : 0,0 en haut a gauche 
    //C'est beaucoup plus pratique pour manipuler une image
    const result = spiralf.getNewLatticeCoordinatesFor(req.params.position)
    res.send({"x0" : result[0], "y0" : result[1]});

});

router.get('/getSquareSize/:position',  function (req, res, next) {

    //renvoi la taille d'un coté du carré dans lequel est inclus un pixel selon sa position/. Ex : pour la position 31, le pixel  
    // a pour position > [2, 3] . Il est inclus dans un carré ayant 7 de coté (3*2)+1 .
    // Refentiel : tous

    res.send({"square_size" : spiralf.getSquareSize(req.params.position)});
});

module.exports = router;