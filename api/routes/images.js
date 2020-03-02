var express = require('express');
var router = express.Router();
var Jimp = require('jimp');



const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


// Create a new MongoClient
const client = new MongoClient(process.env.MONGODB_URI);

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(process.env.MONGO_DB);
  //client.close();
});


const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('positions');
    // Find some documents
    collection.find({_id : 'events'}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs[0].position);
      if(callback) {callback(docs[0].position); 
         client.close();
        } 
      else {return docs[0].position;  
        client.close();
    }
    });

  }


const mongoose = require('mongoose'), Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true });
var Positions = mongoose.model('Positions', new Schema(), 'positions');

router.all('/', function (req, res, next) {

   // console.log(Positions.find({ _id : 'events'}));
  findDocuments(client.db(process.env.MONGO_DB, function retour(pos){
   }));
  res.send('ok'+pos);
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