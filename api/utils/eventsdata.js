

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mquery = require('mquery');

const lastposition = function(callback){

    // Use connect method to connect to the server
    require('mongodb').connect(process.env.MONGODB_URI, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        var db2 = client.db(process.env.MONGO_DB);
        if (err) return handleError(err);     
        // get a collection
        var collection = db2.collection('positions');
        // pass it to the constructor
        mquery(collection).findOne({
            _id: 'events'
        }, function (err, doc) {
            callback(doc.position);
        });
      })

}



module.exports = {
    lastposition: lastposition

};