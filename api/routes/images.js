var express = require('express');
var router = express.Router();
var Jimp = require('jimp');
var utils = require('../utils/functions');
const eventdata = require('../utils/eventsdata');
const fs = require('fs');
var async = require("async");
var ulam = require('../utils/ulam');
const rgbHex = require('rgb-hex');


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
  const path = __dirname + '/../public/images/art'+req.params.position+'-ok.png';

  function checklastposition(callback){
    console.log('checklastposition');
    eventdata.lastposition(function (lastp) {
  
      console.log('checklastposition 2');
      if (lastp > req.params.position) {
        console.log('last position='+lastp);
        callback(null,lastp);
      } else {
        res.send({ error: "position not in eventstore" });
        return;
      }

    });
    
  }


  function filexists(lastp,callback) {
    let pathfile = __dirname + '/../public/images/art'+req.params.position+'-ok.png';
    console.log('dans filexists2 avec pathfile=' + pathfile);
    
    fs.access(pathfile, fs.F_OK, (err) => {
      if (err) {
        console.error(err)
        callback(null,0,lastp);
      } else {
        console.log('dans filexists2 avec retour 1 et lastp='+lastp);
        callback(null,1,lastp);
      }
    })
  };

  function newimage(fileexist, lastp,callback) {
    console.log('dans newimage');
    if (!fileexist) {
      let pathtmp = __dirname + '/../public/images/art'+req.params.position+'.png';
      fs.copyFile(__dirname + '/../public/images/empty.png', pathtmp, (err) => {
        if (err) throw err;
        console.log('dans newimage > creation nouvelle image :'+pathtmp);
      callback(null, pathtmp,lastp);
      });
    } else {
      console.log('dans newimage > image existe deja');
      res.send({error : "file exist"});
      return;
    }
  }

  function Jimpread(tmpimage,lastp, callback) {
    console.log('dans Jimpread avec lastp = '+lastp);
    if (tmpimage) {
      
      console.log('Jimp va ecrire dans '+tmpimage);
      //on prend la position du dernier pixel : ex : 123. Et on va en deduire la taille du carré max. 
      let size = ulam.getSquareSize(lastp);
      let coordinate = ulam.getNewLatticeCoordinatesFor(lastp);
      Jimp.read(tmpimage, (err, art01) => {
        if (err) throw err;
        console.log(typeof(req.params.r)+' '+req.params.g+' '+ req.params.b+' ' +req.params.alpha+' '+coordinate[0]+' '+coordinate[1])
        let r = parseInt(req.params.r);
        let g = parseInt(req.params.g);
        let b = parseInt(req.params.b);
        let alpha = parseFloat(req.params.alpha);
        art01
          .resize(size, size) // resize
          .rgba(true)
          .setPixelColor(rgbHex(r, g, b, alpha), coordinate[0], coordinate[1])
          .write(tmpimage)
        // image.setPixelColor(hex, x, y); // sets the colour of that pixel



        // arg1 now equals 'Task 1' and arg2 now equals 'Task 2'
        let arg3 = tmpimage + ' and nouveau fichier ok la hauteur du fichier est : '+art01.bitmap.height+ ' est sa longeur est :'+art01.bitmap.width;
        console.log(arg3);

        fs.copyFile(tmpimage, __dirname + '/../public/images/art'+req.params.position+'-ok.png', (err) => {
          if (err) throw err;
          console.log('>>>>>dans jimp copy de image :'+tmpimage+' vers '+__dirname + '/../public/images/art'+req.params.position+'-ok.png');
          callback(null, arg3);

        });


      });


    }
    else {

      callback(null, 'Erreur JIMP : pas de fichier ');
    }

  }


  // P = position du pixel a ajouté.
  // si P > que la derniere position dans le store : on a un soucis, on arrète. En effet, le pixel n'est peut etre pas encore ajouté, ou c'est une erreur 


  async.waterfall([
    checklastposition,
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