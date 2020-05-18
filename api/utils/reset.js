require('dotenv').config();
const fs = require('fs');
var glob = require("glob");

//database cleaning
const mongoose = require('mongoose'), Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });   

const connection = mongoose.connection;
connection.once("open", function() {
console.log("MongoDB connected using Mongoose.");

connection.db.dropCollection(
    'events',
function(err, result) {
console.log("Collection events droped");
}
);

connection.db.dropCollection(
    'positions',
function(err, result) {
console.log("Collection positions droped");
}
);


//file cleaning 

const path = '../public/images/Art0x.png';
const emptypath = '../public/images/empty.png';
fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
      return
    }
  
    console.log(path+' removed');
  })

// destination.txt will be created or overwritten by default.


fs.copyFile(emptypath,path, (err) => {
    if (err) throw err;
    console.log(emptypath+' was copied to '+path);
  });

// il faudrait que je copie un Art0x.png vide sur AWS S3..

  glob('../public/images/art*.png', function(err, files) {
    
var arrayLength = files.length;

for (var i = 0; i < arrayLength; i++) {
   fs.unlink(files[i], (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(files[i]+' removed !');
  })
}
/*
    fs.unlink(element.toString(), (err) => {
        if (err) {
          console.error(err)
          return
        }
        console.log(files.toString()+' removed !');
      })
*/



});

/*
fs.unlink(path, (err) => {
  if (err) {
    console.error(err)
    return
  }

  //file removed
})

*/


});
