const request = require('request-promise');
// var request = require("request");
var cheerio = require("cheerio");
var telebot = require('./telebot');
var db = require('./db');

exports.reqFunc = function (invenData, resultCallback) {
    const options = {
        method: 'GET',
        uri: invenData.dolvenInfoBbsMobileUrl
    };

    // function resCallback(err, response, body) {
    function resCallback(body) {
        // if (err) {
        //     console.log(err);
        //     return ;
        // }

        var $ = null;
        try {
            $ = cheerio.load(body);
        }
        catch (exception) {
            console.log('load url failed: ' + exception);
        }

        var newPosts = [];
        if (!$) {
            resultCallback(newPosts);
            return ;
        }

        var nNumbers = [8912, 9365];
        var lastPost = $("ul.list li.articleSubject a.subject");
        var categories = ['[유저]', '[블루]'];
        for (var i = 0 ; i < lastPost.length ; i++) {
            var post = $(lastPost[i]);
            var href = post.attr('href');
            var addr = href.split('?');
            if (addr.length > 1) {
                var params = addr[1].split('&');
                var numParam = params[params.length - 1];
                var numParamArr = numParam.split('=');
                if (numParamArr.length > 1) {
                    var postNum = numParamArr[1];
                    if (postNum == invenData.noticeNumber)
                        continue;
                    for (var j = 0; j < nNumbers.length ; j++) {
                        if (postNum == nNumbers[j])
                            continue;
                    }
                    if (invenData.lastNumber < 0) {
                        // db.saveDataJsonDb('lastNumber', postNum);
                        var newVal = {};
                        for (var attr in invenData) {
                            newVal[attr] = invenData[attr];
                        }
                        newVal.lastNumber = postNum;
                        db.saveDataJsonDb(invenData, newVal);
                        break;
                    }
                    if (postNum > invenData.lastNumber) {
                        var titleElement = post.find('span.title');
                        var element = $(titleElement[0]);
                        var found = false;
                        for (var j=0; j<categories.length ; j++) {
                            if (element[0].children[0].children[0].data == categories[j]) {
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                            for (var j = 0 ; j < element[0].children.length ; j++) {
                                var child = $(element[0].children[j]);
                                if (child[0].type == 'text' && child[0].data.length > 1) {
                                    var postTitle = child[0].data;
                                    var postUrl = "http://m.inven.co.kr" + href;
                                    var postObj = { postNum: postNum, postTitle: postTitle, postUrl: postUrl };
                                    newPosts.push(postObj);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (newPosts.length == 0) {
            console.log("There's no new post. Last post: " + invenData.lastNumber);
        }
        else {
            newPosts.reverse();
        }
        resultCallback(newPosts);
    };

    // request(invenData.dolvenInfoBbsMobileUrl, resCallback)
    request(options)
        .then(function (res) {
            // console.log(res);
            resCallback(res);
        })
        .catch(function (e) {
            console.log(e);
        });
};
