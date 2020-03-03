const fs = require('fs')
var async = require("async");




const filexists = function(path, callback){
    console.log('path='+path);
    fs.access(path, fs.F_OK, (err) => {
        if (err) {
          //console.error(err)
          callback(null,0);
        } else {
            callback(null,1);
        }
      

      })
};

module.exports = {
    filexists: filexists

};