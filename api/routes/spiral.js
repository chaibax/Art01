var express = require('express');
var router = express.Router();

var spiral = require('zero-indexed-ulam-spiral');
// => https://www.npmjs.com/package/zero-indexed-ulam-spiral

router.get('/getLatticeCoordinatesFor/:position',  function (req, res, next) {

    //retourne, en donnant des coordonnés x,y, la position, dans le sens numero de pixel (ex : pixel 129). Refentiel : 0,0 au centre 
    let result = spiral.getLatticeCoordinatesFor(req.params.position);   
    res.send({"x" : result[0], "y" : result[1]});

});

router.get('/getSpiralIndexForCoordinates/:x/:y',  function (req, res, next) {

    //retourne la position, dans le sens numero de pixel (ex : pixel 129), en partant des coordonnés x,y. Refentiel : 0,0 au centre 
    let result = spiral.getSpiralIndexForCoordinates([req.params.x,req.params.y]);   
    res.send({"position" : result});
});


router.get('/getNewLatticeCoordinatesFor/:position',  function (req, res, next) {
    //Obtenir les cooronnées d'un pixel avec une orginie 0,0 en haut a gauche plustot qu'au centre du carré. Refentiel : 0,0 en haut a gauche 
    //C'est beaucoup plus pratique pour manipuler une image
    
    //coordonnée dans le referentien avec 0,0 au centre  :
    let result_old = spiral.getLatticeCoordinatesFor(req.params.position);   
    //res.send({"x" : result_old[0], "y" : result_old[1]});
    let result = spiral.getLatticeCoordinatesFor(req.params.position);   
    let size = Math.max(Math.abs(result[0]),Math.abs(result[1]));

    //coordonné dans le nouveau referentiel
    res.send({"x0" : (result_old[0]+size), "y0" : (result_old[1]-size)});

});

router.get('/getSquareSize/:position',  function (req, res, next) {

    //renvoi la taille d'un coté du carré dans lequel est inclus un pixel selon sa position/. Ex : pour la position 31, le pixel  
    // a pour position > [2, 3] . Il est inclus dans un carré ayant 7 de coté (3*2)+1 .
    // Refentiel : tous
    let result = spiral.getLatticeCoordinatesFor(req.params.position);   
    let size = Math.max(Math.abs(result[0]),Math.abs(result[1]));
    res.send({"square_size" : ((2*size)+1)});
});

module.exports = router;