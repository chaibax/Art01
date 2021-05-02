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
            let pixelparams = { given_name : given_name, position: myPix.position, date : commitStamp, red: red, green: green, blue: blue, alpha: opacity.toFixed(4) };
            tab[i] = pixelparams;
           // console.log('tab0 = '+tab.length);
            i++;
           
        });
       
        await client.close();
        return [tab,i];
        //console.log('FIN')
    
      } catch (e) {
        console.error(e);
      } finally {
       
        //        res.jsonp(tab);
       


      }
}

router.get('/', async function(req, res, next) {
 var tmp ;
 tmp = await  get_pixels();
 res.json(tmp[0]);

});

router.get('/svg', async function(req, res, next) {
  
  //await get_pixels(res);

 var svg_file ;
 svg_file = await get_pixels();
 var svg = '<?xml version="1.0" encoding="utf-8" ?>';
 svg += '<svg baseProfile="full" height="29px" version="1.1" width="29px" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xlink="http://www.w3.org/1999/xlink"><defs />'
 
console.log(svg_file[0])
for (var i = 0; i < svg_file.length; i++){
  console.log("<br><br>array index: " + i);
  var obj = svg_file[i];
  svg +='<rect fill="rgb('+obj['red']+','+obj['green']+','+obj['blue']+')" height="1px" opacity="'+obj['alpha']+'" width="1px" x="'+obj['position']+'px" y="0px" />'
}
 svg +='</svg>';
 res.send(svg);
 
 });




module.exports = router;
