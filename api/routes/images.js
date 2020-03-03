var express = require('express');
var router = express.Router();
var Jimp = require('jimp');
var utils = require('../utils/functions');
const eventdata = require('../utils/eventsdata');
const fs = require('fs');
var async = require("async");



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

  const path = __dirname + '/../public/images/art01.png';

  function filexists(pathfile,callback) {
    console.log('dans filexists2 avec pathfile=' + pathfile);
    
    fs.access(pathfile, fs.F_OK, (err) => {
      if (err) {
        console.error(err)
        callback(null,0);
      } else {
        console.log('dans filexists2 avec retour 1');
        callback(null,1);
      }
    })
  };

  function newimage(fileexist, callback) {
    console.log('dans newimage');
    if (!fileexist) {
      fs.createReadStream(__dirname + '/../public/images/empty.png').pipe(fs.createWriteStream(path));
      console.log('dans newimage > creation nouvelle image');
      callback(null, 1);
    } else {
      console.log('dans newimage > image existe deja');
      callback(null, 2);
    }
  }

  function Jimpread(fileexist, callback) {
    console.log('dans Jimpread');
    if (fileexist) {
      Jimp.read(path, (err, art01) => {
        if (err) throw err;
        art01
          .resize(1256, 1256) // resize
          .quality(90) // set JPEG quality
          .greyscale() // set greyscale
          .write(path); // save

        // arg1 now equals 'Task 1' and arg2 now equals 'Task 2'
        let arg3 = fileexist + ' and nouveau fichier ok';
        console.log(arg3);
        callback(null, arg3);

      });


    }
    else {

      callback(null, 'Erreur JIMP : pas de fichier ');
    }

  }


  async.waterfall([
    async.constant(path),
    filexists, //utils.filexists
    newimage,
    Jimpread // Jimp.read

  ], function (err, result) {
    // see https://medium.com/velotio-perspectives/understanding-node-js-async-flows-parallel-serial-waterfall-and-queues-6f9c4badbc17
    console.log(result);
    res.send(result);
  });







});



/*
//if you are following along, create the following 2 images relative to this script:
let imgRaw = 'raw/image1.png'; //a 1024px x 1024px backgroound image
let imgLogo = 'raw/logo.png'; //a 155px x 72px logo
//---

let imgActive = 'active/image.jpg';
let imgExported = 'export/image1.jpg';

let textData = {
  text: '© JKRB Investments Limited', //the text to be rendered on the image
  maxWidth: 1004, //image width - 10px margin left - 10px margin right
  maxHeight: 72+20, //logo height + margin
  placementX: 10, // 10px in on the x axis
  placementY: 1024-(72+20)-10 //bottom of the image: height - maxHeight - margin 
};

//read template & clone raw image 
Jimp.read(imgRaw)
  .then(tpl => (tpl.clone().write(imgActive)))

  //read cloned (active) image
  .then(() => (Jimp.read(imgActive)))

  //combine logo into image
  .then(tpl => (
    Jimp.read(imgLogo).then(logoTpl => {
      logoTpl.opacity(0.2);
      return tpl.composite(logoTpl, 512-75, 512, [Jimp.BLEND_DESTINATION_OVER, 0.2, 0.2]);
    });
  )

  //load font	
  .then(tpl => (
    Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => ([tpl, font]))
  ))
	
  //add footer text
  .then(data => {

    tpl = data[0];
    font = data[1];
  
    return tpl.print(font, textData.placementX, textData.placementY, {
      text: textData.text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, textData.maxWidth, textData.maxHeight);
  })

  //export image
  .then(tpl => (tpl.quality(100).write(imgExported)))

  //log exported filename
  .then(tpl => { 
    console.log('exported file: ' + imgExported);
  })

  //catch errors
  .catch(err => {
    console.error(err);
  });
  */



module.exports = router;