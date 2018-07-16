var mongoClient = require("mongodb").MongoClient;
var file = require('./file');

var dbInstance;
var dbCollection;
var completeCallback;
var invenData;
var dbData;

var keyName;
var valName;

function _loadJsonFile(filePath) {
  return file.loadDataJsonFile(filePath);
}

function _getDefaultInvenData() {
  return _loadJsonFile('./data/invenData.json');
}

function _getDefaultDbData() {
  return _loadJsonFile('./data/dbData.json');
}

function _getDbUrl() {
  var url = "mongodb://" + dbData.ip + ":" + dbData.port + "/" + dbData.collection;
  // url = "mongodb://" + dbuser + ":" + dbpassword + "@" + dbIp + ":" + dbPort + "/" + dbData.collection;
  return url;
}

function createCollection() {
  dbInstance.createCollection(dbData.collection, function(err, res) {
      if (err) throw err;
      console.log("collection created: " + dbData.collection);
      findOne(res);
  });
}

function findOne(collection) {
  collection.findOne({}, function(err, result) {
    if (err) throw err;
    if (result) {
      console.log("DB is already inited!");
      _doComplete(result);
    }
    else {
      console.log("init record is required");
      insertOne(collection, invenData);
    }
  });
}

function insertOne(collection, obj) {
  collection.insertOne(obj, function(err, res) {
    if (err) throw err;
    console.log("init record inserted");
    _doComplete(res);
  });
}

function _doComplete(res) {
  if (completeCallback) completeCallback(res);
}

function _connect() {
  var url = _getDbUrl();

  mongoClient.connect(url)
    .then((db) => {
      dbInstance = db;
      dbCollection = dbInstance.collection(dbData.collection);
      if (!dbCollection) {
        console.log("init collection is required");
        createCollection();
      }
      else {
        findOne(dbCollection);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

exports.loadDataJsonDb = function (callback) {
  completeCallback = callback;

  dbData = _getDefaultDbData();
  invenData = _getDefaultInvenData();
  _connect();
};

// exports.saveDataJsonDb = function (key, val) {
//   var coll = dbCollection.find();
//   keyName = key;
//   valName = val;
//   coll.forEach(function(element) {
//     var query = { keyName: element.keyName };
//     var newValue = { keyName: valName };
//     dbCollection.update(query, newValue, function (err, res) {
//       if (err) throw err;
//       console.log(res);
//     });
//   });
// };

exports.saveDataJsonDb = function (old, obj) {
  var coll = dbCollection.find();
  coll.forEach(function (element) {
    dbCollection.update(old, obj, function (err, res) {
      if (err) throw err;
      console.log(res);
    });
  });
};