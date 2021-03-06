require('dotenv').config();
var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
var ulam = require('../utils/ulam');

const twitter = require('twitter-lite');
const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
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
      let auth0Id = myPix.payload[2].auth0Id;
      let picture_large = myPix.payload[4].picture_large;
     // console.log('auth0Id = '+auth0Id);
      if(auth0Id.includes("facebook")){
     // console.log('auth0Id = '+auth0Id);
      var fbid = auth0Id.split("|");
     // console.log(fbid[0]+ ' -- '+ fbid[1]);
      picture_large = 'https://graph.facebook.com/'+fbid[1]+'/picture?height=120&width=120&breaking_change=profile_picture';

      if(fbid[1] === '10155911505438072') picture_large = 'https://1000000000.art/1.jpg';
      else if(fbid[1] === '10160018149257388') picture_large = 'https://1000000000.art/3.jpg';
      
      };
      let commitStamp = myPix.commitStamp;
     
      const color = usercolor.split('.');
      const red = color[0];
      const green = color[1];
      const blue = color[2];
      const opacity = color[3] / 255; // a voir ce qui est attendu 
      // console.log('position=' + myPix.position);
      let pixelparams = { given_name: given_name, position: myPix.position, date: commitStamp, red: red, green: green, blue: blue, alpha: opacity.toFixed(8), picture_large: picture_large };
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
  console.log('dans get_pixel avec pos = '+pos)
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
    const query = { 'position': eval(parseInt(position)) };

    var mypix;
    await collection.findOne(query, function (err, result) {

      let usercolor = result.payload[0].pixel;
      let given_name = result.payload[3].given_name;
      let picture_large = result.payload[4].picture_large;
      let commitStamp = result.commitStamp;
      const color = usercolor.split('.');
      const red = color[0];
      const green = color[1];
      const blue = color[2];
      const opacity = color[3] / 255; // a voir ce qui est attendu 
       console.log('commitStamp=' + commitStamp);
      let pixelparams = { given_name: given_name, position: result.position, date: commitStamp, red: red, green: green, blue: blue, alpha: opacity.toFixed(8), picture_large: picture_large };
     
      console.log(pixelparams);

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


router.get('/justone', async function (req, res) {

  var tmp;
  tmp = await get_pixel(req.query.id);
  res.json(tmp);
//res.send(req.query.id);
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
  svg += '<svg baseProfile="full" height="' + size + 'px" version="1.1" width="' + size + 'px" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" ><defs />\r\n'
  //svg+='<style type="text/css" >/* <![CDATA[ */ text {display: none;}; g:hover text {display: block;}}/* ]]> */</style>';
  if (req.query.id >= -1) {
    for (var i = 0; i < svg_file[0].length; i++) {
      let coordinate = ulam.getNewLatticeCoordinatesFor(i, size);
      var obj = svg_file[0][i];
      if (req.query.id == i) {
        svg += '<rect id="painter_' + i + '" fill="rgb(' + obj['red'] + ',' + obj['green'] + ',' + obj['blue'] + ')"   opacity="' + obj['alpha'] + '" height="1px" width="1px" x="' + coordinate[0] + 'px" y="' + coordinate[1] + 'px" >\r\n'
        svg += '<animate attributeName="opacity" from="0" to="1" dur="3" begin=".1s" fill="remove" repeatCount="4"/>\r\n';
        svg += '<animate attributeName="fill" values="red;green;blue" dur="3" begin=".1s" fill="remove" repeatCount="4" />'
        svg += '</rect>\r\n';

      } else {
        svg += '<rect id="painter_' + i + '" fill="rgb(' + obj['red'] + ',' + obj['green'] + ',' + obj['blue'] + ')"  style="fill-opacity: ' + obj['alpha'] + ';"  stroke="transparent" fill-opacity="' + obj['alpha'] + '" opacity="' + obj['alpha'] + '" height="1px" width="1px" x="' + coordinate[0] + 'px" y="' + coordinate[1] + 'px" />\r\n'
      }
    }
  } else if (req.query.displayids >= -1) {
    for (var i = 0; i < svg_file[0].length; i++) {
      let coordinate = ulam.getNewLatticeCoordinatesFor(i, size);
      var obj = svg_file[0][i];
      svg += '<g>\r\n';
      svg += '<rect id="painter_' + i + '" fill="rgb(' + obj['red'] + ',' + obj['green'] + ',' + obj['blue'] + ')"  style="fill-opacity: ' + obj['alpha'] + ';"  stroke="transparent" fill-opacity="' + obj['alpha'] + '" opacity="' + obj['alpha'] + '" height="1px" width="1px" x="' + coordinate[0] + 'px" y="' + coordinate[1] + 'px" />\r\n'
      svg += '<text  x="' + eval(coordinate[0] + 0.5) + 'px" y="' + eval(coordinate[1] + 0.5) + 'px"  alignment-baseline="middle" text-anchor="middle" font-size="0.3" >#' + eval(i + 1) + '</text>\r\n'
      svg += '</g>\r\n'
    }
  }

  else if (req.query.picture >= -1) {
    for (var i = 0; i < svg_file[0].length; i++) {
      let coordinate = ulam.getNewLatticeCoordinatesFor(i, size);
      var obj = svg_file[0][i];


      svg += '<image href="https://i1.wp.com/cdn.auth0.com/avatars/te.png" height="1px" width="1px" x="' + coordinate[0] + '" y="' + coordinate[1] + '" />\r\n'

    }
  }
  else {
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



router.get('/avatars', async function (req, res) {

  //await get_pixels(res);

  var svg_file;
  svg_file = await get_pixels();

  let size = ulam.getSquareSize(svg_file[1]);
  var table = '<div>';
  table += '<svg baseProfile="full" height="' + size + 'px" version="1.1" width="' + size + 'px" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" ><defs />\r\n'
  //svg+='<style type="text/css" >/* <![CDATA[ */ text {display: none;}; g:hover text {display: block;}}/* ]]> */</style>';

  for (var i = 0; i < svg_file[0].length; i++) {
    let coordinate = ulam.getNewLatticeCoordinatesFor(i, size);
    var obj = svg_file[0][i];
    table += '<rect id="painter_' + i + '" fill="rgb(' + obj['red'] + ',' + obj['green'] + ',' + obj['blue'] + ')"  style="fill-opacity: ' + obj['alpha'] + ';"  stroke="transparent" fill-opacity="' + obj['alpha'] + '" opacity="' + obj['alpha'] + '" height="1px" width="1px" x="' + coordinate[0] + 'px" y="' + coordinate[1] + 'px" />\r\n'
  }


  //mydata:position="'+obj['position']+'"  mydata:given_name="'+obj['given_name']+'"
  table += '</div>';
  //res.setHeader('Content-Type', 'image/svg+xml');
  res.send(table);

});

module.exports = router;
