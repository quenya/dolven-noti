var fs = require("fs");

var invenData = {};

exports.loadDataJsonFile = function (filePath, callback) {
    var obj = fs.readFileSync(filePath);
    invenData = JSON.parse(obj);
    return invenData;
};

exports.saveDataJsonFile = function (key, val) {
    invenData[key] = val;
    fs.writeFile('./data/invenData.json', JSON.stringify(invenData), function (err) {
        if (err) throw err;
        console.log('saved!');
    })
}