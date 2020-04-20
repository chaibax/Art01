var spiral = require('zero-indexed-ulam-spiral');

//retourne, en donnant des coordonnés x,y, la position, dans le sens numero de pixel (ex : pixel 129). Refentiel : 0,0 au centre 
var getLatticeCoordinatesFor = function(position) {
    let result = spiral.getLatticeCoordinatesFor(position);   
    return result;
};


//retourne la position, dans le sens numero de pixel (ex : pixel 129), en partant des coordonnés x,y. Refentiel : 0,0 au centre 
var getSpiralIndexForCoordinates = function(x,y) {
    let result = spiral.getSpiralIndexForCoordinates(x,y);   
    return result;
};

var getNewLatticeCoordinatesFor  = function(position, squaresize) {
   
    //Obtenir les cooronnées d'un pixel avec une orginie 0,0 en haut a gauche plustot qu'au centre du carré. Refentiel : 0,0 en haut a gauche 
    //C'est beaucoup plus pratique pour manipuler une image

    //coordonnée dans le referentien avec 0,0 au centre  :
    let result_old = spiral.getLatticeCoordinatesFor(position);   
    //res.send({"x" : result_old[0], "y" : result_old[1]});
    console.log('ancienne position avec 0,0 au centre :');
    console.log(result_old);
    let result = spiral.getLatticeCoordinatesFor(position);   
    let size = squaresize ; //Math.max(Math.abs(result[0]),Math.abs(result[1]));
    //coordonné dans le nouveau referentiel
    
    let modifx = Math.floor(size/2);
    if(result_old[1] == 0) {
       var  newy =  result_old[1] +  Math.floor(size/2);
    } else if (result_old[1] <0){
        var  newy = Math.abs(result_old[1]) + Math.floor(size/2);
    } else {
        var  newy = Math.abs(result_old[1] - Math.floor(size/2));

    }
    
    return [result_old[0]+modifx,newy]
   
};

var getSquareSize = function(position){
    //renvoi la taille d'un coté du carré dans lequel est inclus un pixel selon sa position/. Ex : pour la position 31, le pixel  
    // a pour position > [2, 3] . Il est inclus dans un carré ayant 7 de coté (3*2)+1 .
    // Refentiel : tous

    
    let result = getLatticeCoordinatesFor(position);   
    let size = Math.max(Math.abs(result[0]),Math.abs(result[1]));
    console.log('👉👉 getSquareSize('+position+') = '+((2*size)+1)+ ' result='+result[0]+'/'+result[1])
    return (2*size)+1;
}


module.exports = {
    getSquareSize: getSquareSize,
    getNewLatticeCoordinatesFor: getNewLatticeCoordinatesFor,
    getSpiralIndexForCoordinates: getSpiralIndexForCoordinates,
    getLatticeCoordinatesFor: getLatticeCoordinatesFor

};