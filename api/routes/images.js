var express = require('express');
var router = express.Router();
var Jimp = require('jimp');
var utils = require('../utils/functions');
const eventdata = require('../utils/eventsdata');
const fs = require('fs');
var async = require("async");
var ulam = require('../utils/ulam');


const debug = 1;

function checklastposition(req,callback) {
  eventdata.lastposition(function (lastp) {

    if(debug){
      callback(null, lastp,req);
    } else {

    //console.log('checklastposition 2');
    if (lastp > req.position) {
      // console.log('last position='+lastp);
      callback(null, lastp,req);
    } else {
      console.log("Erreur : position not in eventstore" )
      callback("position not in eventstore" );
      return;
    }
  }

  });

}


function filexists(lastp, req, callback) {
  let pathfile = __dirname + '/../public/images/art' + req.position + '-ok.png';
  // console.log('dans filexists2 avec pathfile=' + pathfile);

  fs.access(pathfile, fs.F_OK, (err) => {
    if (err) {
      // console.error(err)
      callback(null, 0, lastp,req);
    } else {
      // console.log('dans filexists2 avec retour 1 et lastp='+lastp);
      callback(null, 1, lastp,req);
    }
  })
};

function newimage(fileexist, lastp,  req, callback) {
  console.log('dans newimage');
  if (!fileexist) {
    let pathtmp = __dirname + '/../public/images/art' + req.position + '.png';
    fs.copyFile(__dirname + '/../public/images/empty.png', pathtmp, (err) => {
      if (err) throw err;
      console.log('dans newimage > creation nouvelle image avec  req:'+req.position);
      callback(null, pathtmp, lastp,req);
    });
  } else {
    console.log('dans newimage > image existe deja');
    res.send({ error: "file exist" });
    return;
  }
}

function Jimpread(tmpimage, lastp, req, callback) {
  console.log('>>>>>>>>>>>>>> dans Jimpread avec lastp = ' + lastp + '<<<<<<<<<<<<<<<<<<<<<<<<<');
  if (tmpimage) {

    // console.log('Jimp va ecrire dans '+tmpimage);
    //on prend la position du dernier pixel : ex : 123. Et on va en deduire la taille du carré max. 
    console.log('SquareSize ======');
    let size = ulam.getSquareSize(lastp);
    console.log(size);

    console.log('Jimpread position : '+req.position);
    let coordinate = ulam.getNewLatticeCoordinatesFor(req.position, size);
    console.log('nouvelle position avec 0,0 en au a gauche ======');
    console.log(coordinate);


    var jimptmpimage = Jimp.read(tmpimage, (err, art01) => {
      if (err) throw err;
      //console.log(typeof(req.params.r)+' '+req.params.g+' '+ req.params.b+' ' +req.params.alpha+' '+typeof(coordinate[0])+' '+coordinate[1])
      let r = parseInt(req.r);
      let g = parseInt(req.g);
      let b = parseInt(req.b);
      let alpha = parseInt(req.alpha);
      // console.log("========"+typeof(Jimp.rgbaToInt(r, g, b, alpha))+' >>>>>'+Jimp.rgbaToInt(r, g, b, alpha));
      console.log('nouvelle position = ' + req.position + ' avec x = ' + coordinate[0] + ' y =' + coordinate[1]);
      console.log('a ajoute le pixel ayant pour couleur = ' + r + ' . ' + g + ' . ' + b + ' . '+ alpha);

      art01
        .contain(size, size, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE) // resize
        .rgba(true)
        .setPixelColor(Jimp.rgbaToInt(r, g, b, alpha), coordinate[0], coordinate[1])
        .write(tmpimage)
     
      callback(null, tmpimage, lastp);

    
    });

  }
  else {
    callback(null, 'Erreur JIMP : pas de fichier ');
  }
}




function Jimpmerge(tmpimage, lastp, callback) {
  console.log("JimpmergeJimpmergeJimpmergeJimpmerge heroku");
  console.log(tmpimage);
  console.log(typeof (tmpimage));

  if(process.env.HEROKU_API_PATH ) {
    let app_root_path = process.env.HEROKU_API_PATH; 
    var images = [ process.env.HEROKU_API_PATH+'/public/images/Art0x.png', tmpimage];

    fs.access(process.env.HEROKU_API_PATH+ '/public/images/Art0x.png', fs.F_OK, (err) => {
      if (err) {
        //pas d'image Art0x.png, on va donc la crée car c'est peut être Lui. 
        console.log("Pas de image ici h = "+process.env.HEROKU_API_PATH+ '/public/images/Art0x.png');
        console.log(err);
        let pathtmp = process.env.HEROKU_API_PATH+ '/public/images/Art0x.png';
        fs.copyFile(process.env.HEROKU_API_PATH+ '/public/images/empty.png', pathtmp)
        return
      }
      console.log("image existe");
    })

  } else {
    //not in heroku env

    var images = [__dirname + '/../public/images/Art0x.png', tmpimage];

    fs.access(__dirname + '/../public/images/Art0x.png', fs.F_OK, (err) => {
      if (err) {
        console.log("Pas de image ici = "+__dirname + "/../public/images/Art0x.png");
        console.log(err);
        let pathtmp =__dirname + '/../public/images/Art0x.png';
        fs.copyFile(__dirname + '/../public/images/empty.png', pathtmp)
        return
      }
      console.log("image existe  = "+__dirname + "/../public/images/Art0x.png");
    })


  }


  
  //Art0X.png => image source 
  console.log('heroku diname = '+__dirname);
  var jimps = [];

  for (var i = 0; i < images.length; i++) {
    jimps.push(Jimp.read(images[i]));
  }




  Promise.all(jimps).then(function (data) {
    return Promise.all(jimps);
  }).then(function (data) {
    data[1].composite(data[0], 0, 0);
    data[1].write(__dirname + '/../public/images/Art0x.png', function () {
      console.log("> wrote the image");
      callback(null,'wrote the image');
    });
  });

};

//fonction qui va créer une images et la mergé avec l'image de base 
function generateimage(params,callback){

  async.waterfall([
    async.constant(params),
    checklastposition,
    filexists, //utils.filexists
    newimage,
    Jimpread, // Jimp.rea
    Jimpmerge
  ], function (err, result) {
    // see https://medium.com/velotio-perspectives/understanding-node-js-async-flows-parallel-serial-waterfall-and-queues-6f9c4badbc17
    console.log('fin du traitement');
    console.log(result);
    callback(result);
  });
}


// On renvoie un nombre aléatoire entre une valeur min (incluse) 
// et une valeur max (exclue) => pour générer des pixels aléatoire 
function getRandomArbitrary(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


router.all('/', function (req, res, next) {

  eventdata.lastposition(function (msg) {
    //console.log(msg);
    res.send({ last: msg });
  });

});

router.all('/filexists/:position', function (req, res, next) {
  //req.params.position
  const path = __dirname + '/../public/images/' + req.params.position + '.png';
  utils.filexists(path, function (msg) {
    //console.log(msg);
    res.send('{"' + path + '" : ' + msg + '}');
  });

});


router.all('/pixeladd/:position/:r/:g/:b/:alpha', function (req, res, next) {
  //req.params.position
  //const path = __dirname + '/../public/images/art' + req.params.position + '-ok.png';

  console.log('params dans pixeladd=  ');
  console.log(req.params);

  generateimage(req.params, function(res1){
    res.send(res1);
  });

});

router.all('/randompixeladd/:number', function (req, res, next) {
 
  for(let i=0;i<req.params.number;i++){
    console.log('generation image n° '+i);
    let params = { position: i, r: getRandomArbitrary(0, 256), g: getRandomArbitrary(0, 256), b: getRandomArbitrary(0, 256), alpha: getRandomArbitrary(0, 100) };


    console.log('params dans randompixeladd=  ');
    console.log(params);
   
    generateimage(params, function(res1){
      
      if(i == (req.params.number-1)) res.send('generation de '+i+' images OK');
    });
  }


});


router.all('/pngtosvg', function (req, res, next) {
 
res.send('pngtosvg');

});




module.exports = {
  router:router,
  generateimage: generateimage


};

//module.exports = router;