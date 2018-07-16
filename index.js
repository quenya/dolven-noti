// var db = require('./db');
var request = require('./request');
var telebot = require('./telebot');
var fs = require('./file');
var https = require('https');
var http = require('http');

https.globalAgent.maxSockets = 5;
http.globalAgent.maxSockets = 5;

var invenData;
function dbCompleteCallback(res) {
    if (res) {
        invenData = res;
        console.log("last: " + invenData.lastNumber + ", noti: " + invenData.noticeNumber);
        requestCrwaling();
    }
    else {
        console.log("res is null!");
    }
};

// db.loadDataJsonDb(dbCompleteCallback);

invenData = fs.loadDataJsonFile('./data/invenData.json');

function notifyMails(newPosts) {
    newPosts.forEach(function(elem, index, array) {
        console.log(elem.postNum + " " + elem.postTitle + " " + elem.postUrl);
        invenData.lastNumber = Math.max(invenData.lastNumber, elem.postNum);
        sendMail(elem);
    });
};

function notifyBot(newPosts) {
    telebot.sendBotMessages(newPosts);
};

function notifyCallback(newPosts) {
    var oldVal = {};
    for (var attr in invenData) {
        oldVal[attr] = invenData[attr];
    }

    if (newPosts && newPosts.length > 0) {
        newPosts.forEach(function(elem, index, array) {
            console.log(elem.postNum + " " + elem.postTitle + " " + elem.postUrl);
            invenData.lastNumber = Math.max(invenData.lastNumber, elem.postNum);
        });
        console.log("New Last post: " + invenData.lastNumber);
        
        // db.saveDataJsonDb(oldVal, invenData);
        
        notifyBot(newPosts);
    }

    startLoop();
};


function requestCrwaling() {
    request.reqFunc(invenData, notifyCallback);
};

const ReqInterval = 1000 * 60 * 10;
const ReqInterval10Sec = 1000 * 10;
function startLoop() {
    setTimeout(requestCrwaling, ReqInterval);
    // setTimeout(requestCrwaling, ReqInterval10Sec);
}

requestCrwaling();