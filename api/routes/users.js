require('dotenv').config();
var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
var ulam = require('../utils/ulam');


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
      const color = usercolor.split('.');
      const red = color[0];
      const green = color[1];
      const blue = color[2];
      const opacity = color[3] / 255; // a voir ce qui est attendu 
      // console.log('position=' + myPix.position);
      let pixelparams = { given_name: given_name, position: myPix.position, date: commitStamp, red: red, green: green, blue: blue, alpha: opacity };
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
    const query = { 'position': parseInt(position) };

    var mypix;
    await collection.findOne(query, function (err, result) {

      let usercolor = result.payload[0].pixel;
      let given_name = result.payload[3].given_name;
      let commitStamp = result.commitStamp;
      const color = usercolor.split('.');
      const red = color[0];
      const green = color[1];
      const blue = color[2];
      const opacity = color[3] / 255; // a voir ce qui est attendu 
      // console.log('position=' + myPix.position);
      let pixelparams = { given_name: given_name, position: result.position, date: commitStamp, red: red, green: green, blue: blue, alpha: opacity };
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
        svg += '<rect id="painter_' + i + '" fill="rgb(' + obj['red'] + ',' + obj['green'] + ',' + obj['blue'] + ')"  style="fill-opacity: ' + obj['alpha'] + ';"  stroke="transparent" fill-opacity="' + obj['alpha'] + '" opacity="' + obj['alpha'] + '" height="1px" width="1px" x="' + coordinate[0] + 'px" y="' + coordinate[1] + 'px" >\r\n'
        svg += '<animate attributeName="opacity" from="0" to="1" dur="3" begin=".1s" fill="freeze" repeatCount="4"/>\r\n';
        svg += '</rect>\r\n';
      } else {
        svg += '<rect id="painter_' + i + '" fill="rgb(' + obj['red'] + ',' + obj['green'] + ',' + obj['blue'] + ')"  style="fill-opacity: ' + obj['alpha'] + ';"  stroke="transparent" fill-opacity="' + obj['alpha'] + '" opacity="' + obj['alpha'] + '" height="1px" width="1px" x="' + coordinate[0] + 'px" y="' + coordinate[1] + 'px" />\r\n'
      }
    }
  } else {
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
