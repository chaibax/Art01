require('dotenv').config();
const fs = require('fs');
var glob = require("glob");
const { MongoClient } = require('mongodb');
var image = require('../routes/images');
//var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;
var S3 = process.env.AWS_S3_BUCKET;

console.log('url=' + url);
console.log('AWS_S3_BUCKET ==' + S3);
const client = new MongoClient(url);


async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function main() {
  async function pause() {
    console.log(1);
    await sleep(5000);
    console.log(2);
  }

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }


  async function generate(pixelparams) {
    console.log('OK!!!!!');
    console.log('👉 ======');
    await sleep(5000);

    console.log('== FIN sleep ==== 🔥' );

    image.generateimage(pixelparams, function (res1) {
      pause();
      console.log(' ❤️ génération de image ok avec resulta = ' + res1);

      if (!res1) {
        //soucis avec la génération de l'image. Il faudrait : soit ne pas enregistrer le pixel, soit créer un event d'erreur?
        console.log('error :(')
      }
      console.log(res1);
    
    });
  }

  // one liner
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    const database = client.db(process.env.MONGO_DB);
    const collection = database.collection('events');
    const query = { position: 1 };
    //       const pix = await collection.findOne(query);
    //       console.log(pix);
    var i = 0;
   var tab = [];
   await  collection.find().forEach(function (myPix) {

     
        let usercolor = myPix.payload[0].pixel;
        const color = usercolor.split('.');
        const red = color[0];
        const green = color[1];
        const blue = color[2];
        const opacity = Math.round((color[3] / 255) * 100); // a voir ce qui est attendu 
        console.log('position=' + myPix.position);
        let pixelparams = { position: (myPix.position - 1), r: red, g: green, b: blue, alpha: opacity };
        tab[i] = pixelparams;
        console.log('tab0 = '+tab.length);
        i++;
       
    });
    console.log('tab = '+tab.length);
    for (j=0; j< tab.length; j++){
      await  generate(tab[j]);
    }
   



  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

/*
let pixelparams = { position: position_added, r: red, g: green, b: blue, alpha: opacity };

image.generateimage(pixelparams, function (res1) {

  console.log('🌈 génération de image ok avec resulta = ' + res1);

  if( !res1 ) {
    //soucis avec la génération de l'image. Il faudrait : soit ne pas enregistrer le pixel, soit créer un event d'erreur?
  }
  io.emit('newpixel', { 'newpixel' : pixelparams, 'given_name' : req.body.given_name, 'picture' : req.body.picture_large, 'date' : stream.eventsToDispatch[0]['commitStamp'] });
  res.send({ 'position': position_added });
});
*/


