const fs = require('fs')





const filexists = function(path, callback){
    console.log('path='+path);
    fs.access(path, fs.F_OK, (err) => {
        if (err) {
          //console.error(err)
          callback(0);
        } else {
            callback(1);
        }
      

      })
};

module.exports = {
    filexists: filexists

};