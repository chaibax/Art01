var express = require('express');
var router = express.Router();
var Jimp = require('jimp');
var utils = require('../utils/functions');
const eventdata = require('../utils/eventsdata');
const fs = require('fs');
var async = require("async");
var ulam = require('../utils/ulam');
const rgbHex = require('rgb-hex');

var mergeImages = require('merge-images');


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
  const path = __dirname + '/../public/images/art' + req.params.position + '-ok.png';


  function checklastposition(callback) {
    //console.log('checklastposition');
    eventdata.lastposition(function (lastp) {

      //console.log('checklastposition 2');
      if (lastp > req.params.position) {
        // console.log('last position='+lastp);
        callback(null, lastp);
      } else {
        res.send({ error: "position not in eventstore" });
        return;
      }

    });

  }


  function filexists(lastp, callback) {
    let pathfile = __dirname + '/../public/images/art' + req.params.position + '-ok.png';
    // console.log('dans filexists2 avec pathfile=' + pathfile);

    fs.access(pathfile, fs.F_OK, (err) => {
      if (err) {
        // console.error(err)
        callback(null, 0, lastp);
      } else {
        // console.log('dans filexists2 avec retour 1 et lastp='+lastp);
        callback(null, 1, lastp);
      }
    })
  };

  function newimage(fileexist, lastp, callback) {
    //console.log('dans newimage');
    if (!fileexist) {
      let pathtmp = __dirname + '/../public/images/art' + req.params.position + '.png';
      fs.copyFile(__dirname + '/../public/images/empty.png', pathtmp, (err) => {
        if (err) throw err;
        //console.log('dans newimage > creation nouvelle image :'+pathtmp);
        callback(null, pathtmp, lastp);
      });
    } else {
      //console.log('dans newimage > image existe deja');
      res.send({ error: "file exist" });
      return;
    }
  }

  function Jimpread(tmpimage, lastp, callback) {
    console.log('>>>>>>>>>>>>>> dans Jimpread avec lastp = ' + lastp + '<<<<<<<<<<<<<<<<<<<<<<<<<');
    if (tmpimage) {

      // console.log('Jimp va ecrire dans '+tmpimage);
      //on prend la position du dernier pixel : ex : 123. Et on va en deduire la taille du carré max. 
      console.log('SquareSize ======');
      let size = ulam.getSquareSize(lastp);
      console.log(size);

      let coordinate = ulam.getNewLatticeCoordinatesFor(req.params.position, size);
      console.log('nouvelle position avec 0,0 en au a gauche ======');
      console.log(coordinate);


      var jimptmpimage = Jimp.read(tmpimage, (err, art01) => {
        if (err) throw err;
        //console.log(typeof(req.params.r)+' '+req.params.g+' '+ req.params.b+' ' +req.params.alpha+' '+typeof(coordinate[0])+' '+coordinate[1])
        let r = parseInt(req.params.r);
        let g = parseInt(req.params.g);
        let b = parseInt(req.params.b);
        let alpha = parseInt(req.params.alpha);
        // console.log("========"+typeof(Jimp.rgbaToInt(r, g, b, alpha))+' >>>>>'+Jimp.rgbaToInt(r, g, b, alpha));
        console.log('nouvelle position = ' + req.params.position + ' avec x = ' + coordinate[0] + ' y =' + coordinate[1]);
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
    console.log("JimpmergeJimpmergeJimpmergeJimpmerge");
    console.log(tmpimage);
    console.log(typeof (tmpimage));
    //Art0X.png => image source 




    
    var images = [__dirname + '/../public/images/Art0X.png', tmpimage];
    var jimps = [];

    for (var i = 0; i < images.length; i++) {
      jimps.push(Jimp.read(images[i]));
    }

    Promise.all(jimps).then(function (data) {
      return Promise.all(jimps);
    }).then(function (data) {
      data[1].composite(data[0], 0, 0);
      data[1].write(__dirname + '/../public/images/Art0X.png', function () {
        console.log("> wrote the image");
        callback(null,'wrote the image');
      });
    });

  };


  async.waterfall([
    checklastposition,
    filexists, //utils.filexists
    newimage,
    Jimpread, // Jimp.rea
    Jimpmerge
  ], function (err, result) {
    // see https://medium.com/velotio-perspectives/understanding-node-js-async-flows-parallel-serial-waterfall-and-queues-6f9c4badbc17
    console.log('fin du traitement');
    console.log(result);
    res.send(result);
  });

});




module.exports = router;