var fs = require("fs");

exports.loadDataJsonFile = function (filePath, callback) {
    var obj = fs.readFileSync(filePath);
    return JSON.parse(obj);
};

// function saveDataJsonFile(key, val) {
//     invenData.key = val;
//     fs.writeFile('invenData.json', invenData, function (err) {
//         if (err) throw err;
//         console.log('saved!');
//     })
// }
