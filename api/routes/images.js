var express = require('express');
var router = express.Router();
var Jimp = require('jimp');
var utils = require('../utils/functions');
const eventdata = require('../utils/eventsdata');
const fs = require('fs');
var async = require("async");
var ulam = require('../utils/ulam');
const AWS = require('aws-sdk');
const path = require('path');
const https = require('https');

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET
});

var s3 = new AWS.S3();

const debug = 1;

function checklastposition(req, callback) {
  eventdata.lastposition(function (lastp) {

    if (debug) {
      callback(null, lastp, req);
    } else {

      //console.log('checklastposition 2');
      if (lastp > req.position) {
        // console.log('last position='+lastp);
        callback(null, lastp, req);
      } else {
        console.log("Erreur : position not in eventstore")
        callback("position not in eventstore");
        return;
      }
    }

  });

}


function filexists(lastp, req, callback) {


  //https://art01-images.s3.eu-west-3.amazonaws.com/Art0x.png?t=1589131066273
  //let pathfile = __dirname + '/../public/images/art' + req.position + '-ok.png';
  let pathfile = 'https://art01-images.s3.eu-west-3.amazonaws.com/art' + req.position + '-ok.png';
  // console.log('dans filexists2 avec pathfile=' + pathfile);

  fs.access(pathfile, fs.F_OK, (err) => {
    if (err) {
      // console.error(err)
      callback(null, 0, lastp, req);
    } else {
      // console.log('dans filexists2 avec retour 1 et lastp='+lastp);
      callback(null, 1, lastp, req);
    }
  })
};

function newimage(fileexist, lastp, req, callback) {
  if (!fileexist) {
    let pathtmp = __dirname + '/../public/images/art' + req.position + '.png';
    //let pathtmp = 'https://art01-images.s3.eu-west-3.amazonaws.com/art' + req.position + '.png';


    fs.copyFile(__dirname + '/../public/images/empty.png', pathtmp, (err) => {
      if (err) throw err;
      callback(null, pathtmp, lastp, req);
    });


  } else {
    res.send({ error: "file exist" });
    return;
  }
}

function Jimpread(tmpimage, lastp, req, callback) {
  if (tmpimage) {

    // console.log('Jimp va ecrire dans '+tmpimage);
    //on prend la position du dernier pixel : ex : 123. Et on va en deduire la taille du carré max. 
    let size = ulam.getSquareSize(req.position);
    let coordinate = ulam.getNewLatticeCoordinatesFor(req.position, size);


    var jimptmpimage = Jimp.read(tmpimage, (err, art01) => {
      if (err) throw err;
      //console.log(typeof(req.params.r)+' '+req.params.g+' '+ req.params.b+' ' +req.params.alpha+' '+typeof(coordinate[0])+' '+coordinate[1])
      let r = parseInt(req.r);
      let g = parseInt(req.g);
      let b = parseInt(req.b);
      let alpha = parseInt(req.alpha);
      // console.log("========"+typeof(Jimp.rgbaToInt(r, g, b, alpha))+' >>>>>'+Jimp.rgbaToInt(r, g, b, alpha));
      //fix heroku ?
      art01
        .contain(size, size, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE) // resize
        .rgba(true)
        .setPixelColor(Jimp.rgbaToInt(r, g, b, alpha), coordinate[0], coordinate[1])
        .write(tmpimage, callback(null, tmpimage, req));
    });

  }
  else {
    callback(null, 'Erreur JIMP : pas de fichier ');
  }
}


function Jimpmerge(tmpimage, req, callback) {
  if (process.env.HEROKU_API_PATH) {

    var file = fs.createWriteStream(process.env.HEROKU_API_PATH + '/public/images/Art0x.png');
    var localArt0xpath = process.env.HEROKU_API_PATH + '/public/images/Art0x.png';
    var localEmptyImagexpath = process.env.HEROKU_API_PATH + '/public/images/empty.png';

  } else {
    //not in heroku env

    var file = fs.createWriteStream(__dirname + '/../public/images/Art0x.png');
    var localArt0xpath = __dirname + '/../public/images/Art0x.png';
    var localEmptyImagexpath = __dirname + '/../public/images/empty.png';
  }
  const request = https.get(process.env.AWS_S3_ROOT_URL + '/Art0x.png', function (response) {
    response.pipe(file);
    var images = [localArt0xpath, tmpimage];
    fs.access(localArt0xpath, fs.F_OK, (err) => {
      if (err) {
        console.log(err);
        let pathtmp = localArt0xpath;
        fs.copyFile(localEmptyImagexpath, pathtmp, (err) => {
          if (err) throw err;
        });

      }
    })


    var images = [localArt0xpath, tmpimage];
    Jimp.read(tmpimage, function (err, image) {
      if (err) {
        console.log(err);
        //throw err;

      }
      Jimp.read(localArt0xpath, function (err2, image2) {
        if (err2) {
          console.log(err2);
        }
        if (req.position) {
          if (ulam.getSquareSize(req.position) > ulam.getSquareSize(req.position - 1)) {
            //console.log('💄 changement de square size. On passe de ' + ulam.getSquareSize(req.position - 1) + ' a ' + ulam.getSquareSize(req.position - 1));
            image.composite(image2, 1, 1);
          } else {
            //console.log('💄 pas de changement de square size');
            image.composite(image2, 0, 0);
          }
        }
        else {
          image.composite(image2, 0, 0);
        }

        fs.copyFile(__dirname + '/../public/images/Art0x.png', __dirname + '/../public/images/Art0x-' + req.position + '.png', (err) => {
          if (err) {
            throw err;
          }
          image.write(__dirname + '/../public/images/Art0x.png', function () {
            console.log("> wrote the new image Art0x.png");
            callback(null, tmpimage, req);
          });
        });
      })
    });

  });
  ;

};


function save_on_the_cloud_old_art0x(tmpimage, req, callback) {

  if (!tmpimage) {
    callback(true);
  }

  var tmp_url = __dirname + '/../public/images/Art0x-' + req.position + '.png';
  var params = {
    Bucket: 'art01-images',
    Body: fs.createReadStream(tmp_url),
    Key: path.basename(tmp_url)
  };
  s3.upload(params, function (err, data) {
    //handle error
    if (err) {
      console.log("Error in save_on_the_cloud_old_art0x", err);
    }
    //success
    if (data) {
      callback(null, tmpimage, req);
    }
  });
}

function save_on_the_cloud_tmpimage(pathtouse, req, callback) {
  if (!pathtouse) {
     callback(true);
  }

  var tmpimage = pathtouse;
  var params = {
    Bucket: 'art01-images',
    Body: fs.createReadStream(pathtouse),
    Key: path.basename(pathtouse)
  };
  s3.upload(params, function (err, data) {
    //handle error
    if (err) {
      console.log("Error in save_on_the_cloud_tmpimage", err);
    }
    //success
    if (data) {
      callback(null, tmpimage, req);
    }
  });
}


function save_on_the_cloud_art0x(pathtouse, req, callback) {

  if (!pathtouse) {
    callback(true);
  }
  var pathtouse = __dirname + "/../public/images/Art0x.png";
  var params = {
    Bucket: 'art01-images',
    Body: fs.createReadStream(pathtouse),
    Key: path.basename(pathtouse)
  };
  s3.upload(params, function (err, data) {
    //handle error
    if (err) {
      console.log("Error in save_on_the_cloud_art0x", err);
    }
    //success
    if (data) {
      callback(null, pathtouse, req);
    }
  });
}



//fonction qui va créer une images et la mergé avec l'image de base 
function generateimage(params, callback) {

  async.waterfall([
    async.constant(params),
    checklastposition,
    filexists, //utils.filexists
    newimage,
    Jimpread, // Jimp.rea
    Jimpmerge,
    save_on_the_cloud_old_art0x,
    save_on_the_cloud_tmpimage,
    save_on_the_cloud_art0x
  ], function (err, result) {
    if (err) callback(0);
    // see https://medium.com/velotio-perspectives/understanding-node-js-async-flows-parallel-serial-waterfall-and-queues-6f9c4badbc17
    console.log('💚fin du traitement');
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
  generateimage(req.params, function (res1) {
    res.send(res1);
  });

});

router.all('/randompixeladd/:number', function (req, res, next) {

  for (let i = 0; i < req.params.number; i++) {
    console.log('generation image n° ' + i);
    let params = { position: i, r: getRandomArbitrary(0, 256), g: getRandomArbitrary(0, 256), b: getRandomArbitrary(0, 256), alpha: getRandomArbitrary(0, 100) };
    console.log('params dans randompixeladd=  ');
    console.log(params);
    generateimage(params, function (res1) {

      if (i == (req.params.number - 1)) res.send('generation de ' + i + ' images OK');
    });
  }


});


router.all('/pngtosvg', function (req, res, next) {
  res.send('pngtosvg');

});




module.exports = {
  router: router,
  generateimage: generateimage


};

//module.exports = router;