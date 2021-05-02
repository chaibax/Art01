require('dotenv').config();
var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');

/* GET users listing. */

async function get_pixels(res){

  try {
      const uri = process.env.MONGODB_URI;
      const client = new MongoClient(uri);
    
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
            let given_name = myPix.payload[3].given_name;
            let commitStamp = myPix.commitStamp;
            const color = usercolor.split('.');
            const red = color[0];
            const green = color[1];
            const blue = color[2];
            const opacity = color[3] / 255; // a voir ce qui est attendu 
           // console.log('position=' + myPix.position);
            let pixelparams = { given_name : given_name, position: myPix.position, date : commitStamp, red: red, green: green, blue: blue, alpha: opacity };
            tab[i] = pixelparams;
           // console.log('tab0 = '+tab.length);
            i++;
           
        });
        res.json(tab);
        await client.close();
        //console.log('FIN')
    
      } catch (e) {
        console.error(e);
      } finally {
       
        //        res.jsonp(tab);
       


      }
}

router.get('/', async function(req, res, next) {
  
 await get_pixels(res);


});



module.exports = router;
