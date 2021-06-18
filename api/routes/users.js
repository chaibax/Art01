require('dotenv').config();
var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
var ulam = require('../utils/ulam');

const twitter = require('twitter-lite');
const client = new twitter({  
  consumer_key: process.env.TWITTER_CONSUMER_KEY ,  
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,  
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,  
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET  
});



/* GET users/pixels listing. */
async function get_pixels(res) {
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
    await collection.find().forEach(function (myPix) {
      let usercolor = myPix.payload[0].pixel;
      let given_name = myPix.payload[3].given_name;
      let commitStamp = myPix.commitStamp;
      let picture_large = myPix.payload[4].picture_large;
      const color = usercolor.split('.');
      const red = color[0];
      const green = color[1];
      const blue = color[2];
      const opacity = color[3] / 255; // a voir ce qui est attendu 
      // console.log('position=' + myPix.position);
      let pixelparams = { given_name: given_name, position: myPix.position, date: commitStamp, red: red, green: green, blue: blue, alpha: opacity.toFixed(8),picture_large : picture_large };
      tab[i] = pixelparams;
      // console.log('tab0 = '+tab.length);
      i++;
    });

    await client.close();
    return [tab, i];
    //console.log('FIN')
  } catch (e) {
    console.error(e);
  } finally {
    //        res.jsonp(tab);
  }
}

/* GET one user/pixel listing. */
async function get_pixel(pos) {
  try {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);
    // Connect to the MongoDB cluster
    await client.connect();
    // Make the appropriate DB calls
    const database = client.db(process.env.MONGO_DB);
    const collection = database.collection('events');
    var position = 0;
    position = pos;
    const query = { 'position': eval(parseInt(position)+1) };

    var mypix;
    await collection.findOne(query, function (err, result) {

      let usercolor = result.payload[0].pixel;
      let given_name = result.payload[3].given_name;
      let picture_large = myPix.payload[4].picture_large
      let commitStamp = result.commitStamp;
      const color = usercolor.split('.');
      const red = color[0];
      const green = color[1];
      const blue = color[2];
      const opacity = color[3] / 255; // a voir ce qui est attendu 
      // console.log('position=' + myPix.position);
      let pixelparams = { given_name: given_name, position: result.position, date: commitStamp, red: red, green: green, blue: blue, alpha: opacity.toFixed(8),picture_large :picture_large };
      // console.log('tab0 = '+tab.length);

      mypix = pixelparams;
    });

    await client.close();
    return mypix;//pixelparams;
    //console.log('FIN')
  } catch (e) {
    console.error(e);
  } finally {
    //        res.jsonp(tab);
  }
}

router.get('/', async function (req, res, next) {
  var tmp;
  tmp = await get_pixels();
  res.json(tmp[0]);

});


router.get('/twitter', async function (req, res, next) {

  client.post('statuses/update', { status: 'Test du 31 mai' }).then(result => {
    console.log('You successfully tweeted this : "' + result.text + '"');
    res.send('You successfully tweeted this : "' + result.text + '"')
  }).catch(console.error);

});


router.get('/svg', async function (req, res) {

  //await get_pixels(res);

  var svg_file;
  svg_file = await get_pixels();

  let size = ulam.getSquareSize(svg_file[1]);
  var svg = '<?xml version="1.0" encoding="utf-8" ?>';

  svg += '<svg baseProfile="full" height="' + size + 'px" version="1.1" width="' + size + 'px" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xlink="http://www.w3.org/1999/xlink"><defs />\r\n'

  //console.log(svg_file[0])
  if (req.query.id >= -1) {
    for (var i = 0; i < svg_file[0].length; i++) {
      let coordinate = ulam.getNewLatticeCoordinatesFor(i, size);
      var obj = svg_file[0][i];
      if (req.query.id == i) {
        svg += '<rect id="painter_' + i + '" fill="rgb(' + obj['red'] + ',' + obj['green'] + ',' + obj['blue'] + ')"   opacity="' + obj['alpha'] + '" height="1px" width="1px" x="' + coordinate[0] + 'px" y="' + coordinate[1] + 'px" >\r\n'
       svg += '<animate attributeName="opacity" from="0" to="1" dur="3" begin=".1s" fill="remove" repeatCount="4"/>\r\n';
       svg +=  '<animate attributeName="fill" values="red;green;blue" dur="3" begin=".1s" fill="remove" repeatCount="4" />'

       
     //  svg +=  '<animate attributeName="stroke" values="red;blue;red" dur="3" begin=".1s" fill="remove" repeatCount="4" />'
      // svg +=  '<animate attributeName="stroke-opacity" from="0" to="1" dur="3" begin=".1s" fill="remove" repeatCount="4"/>'
     
       //    svg += '<animate attributeName="width" from="0" to="10" dur="3" begin=".1s" fill="remove" repeatCount="4"/>\r\n';
    //    svg += '<animate attributeName="height" from="0" to="10" dur="3" begin=".1s" fill="remove" repeatCount="4"/>\r\n';
    //svg +='<animateTransform attributeName="transform" type="rotate" from="0 190 50" to="360 190 50" dur="4s" repeatCount="indefinite" />';
        svg += '</rect>\r\n';

      } else { 
        svg += '<rect id="painter_' + i + '" fill="rgb(' + obj['red'] + ',' + obj['green'] + ',' + obj['blue'] + ')"  style="fill-opacity: ' + obj['alpha'] + ';"  stroke="transparent" fill-opacity="' + obj['alpha'] + '" opacity="' + obj['alpha'] + '" height="1px" width="1px" x="' + coordinate[0] + 'px" y="' + coordinate[1] + 'px" />\r\n'
      }
    }
  } else if(req.query.displayids >= -1) {
    for (var i = 0; i < svg_file[0].length; i++) {
      let coordinate = ulam.getNewLatticeCoordinatesFor(i, size);
      var obj = svg_file[0][i];
      svg += '<g>\r\n';
      svg += '<rect id="painter_' + i + '" fill="rgb(' + obj['red'] + ',' + obj['green'] + ',' + obj['blue'] + ')"  style="fill-opacity: ' + obj['alpha'] + ';"  stroke="transparent" fill-opacity="' + obj['alpha'] + '" opacity="' + obj['alpha'] + '" height="1px" width="1px" x="' + coordinate[0] + 'px" y="' + coordinate[1] + 'px" />\r\n'
      svg += '<text  x="' + eval(coordinate[0]+0.25) + 'px" y="' + eval(coordinate[1]+0.5) + 'px"  font-size="0.1" >Painter #'+i+'</text>\r\n'
      svg += '</g>\r\n'
    }
  } 
  
  else if(req.query.picture >= -1) {
    for (var i = 0; i < svg_file[0].length; i++) {
      let coordinate = ulam.getNewLatticeCoordinatesFor(i, size);
      var obj = svg_file[0][i];
 

      svg += '<image  xlink:href="https://i1.wp.com/cdn.auth0.com/avatars/te.png?ssl=1" height="1px" width="1px" x="' + coordinate[0] + '" y="' + coordinate[1] + '" />\r\n'
    
    }
  }
  else{
    for (var i = 0; i < svg_file[0].length; i++) {
    let coordinate = ulam.getNewLatticeCoordinatesFor(i, size);
    var obj = svg_file[0][i];
    svg += '<rect id="painter_' + i + '" fill="rgb(' + obj['red'] + ',' + obj['green'] + ',' + obj['blue'] + ')"  style="fill-opacity: ' + obj['alpha'] + ';"  stroke="transparent" fill-opacity="' + obj['alpha'] + '" opacity="' + obj['alpha'] + '" height="1px" width="1px" x="' + coordinate[0] + 'px" y="' + coordinate[1] + 'px" />\r\n'
  }
  }

  //mydata:position="'+obj['position']+'"  mydata:given_name="'+obj['given_name']+'"
  svg += '</svg>';
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);

});



router.get('/mysvg', async function (req, res) {

  //await get_pixels(res);
  var svg_file;
  pixel = await get_pixel(req.query.id);
  var svg = '<?xml version="1.0" encoding="utf-8" ?>';
  svg += '<svg baseProfile="full" height="1px" version="1.1" width="1px" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xlink="http://www.w3.org/1999/xlink"><defs />\r\n';
  svg += '<rect id="painter_' + req.query.id + '" fill="rgb(' + pixel.red + ',' + pixel.green + ',' + pixel.blue + ')"  style="fill-opacity: ' + pixel.alpha + ';"  stroke="transparent" fill-opacity="' + pixel.alpha + '" opacity="' + pixel.alpha + '" height="1px" width="1px" x="0px" y="0px" />\r\n'
  svg += '</svg>';
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);

});


module.exports = router;
