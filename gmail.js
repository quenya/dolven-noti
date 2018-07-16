var nodemailer = require("nodemailer");

exports.transport = function () {
    nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'quendya7@gmail.com',
            pass: 'telerin7'
        }
    });
};

exports.sendMail = function (post) {
    var htmlBody = '<h1><a href=' + invenData.boardUrl + '>인벤 실시간 유저 정보 (바로가기)</a></h1>';
    htmlBody += '<br>';
    htmlBody += '<h1><a href=' + post.postUrl + '>' + post.postTitle + '(원문보기)</a></h1>';
    htmlBody += '<br>';
    request(post.postUrl, function(err, resp, body) {
        if (err) throw err;

        var $ = cheerio.load(body);
        var articleContent = $('.articleContent');
        htmlBody += $(articleContent).html();

        var mailOptions = {
            from: '돌크롤러 <quendya7@gmail.com>',
            to: 'quendya7@gmail.com',
            subject: post.postTitle,
            html: htmlBody
        };

        smtpTransport.sendMail(mailOptions, function(err, res) {
            if (err)
                console.log(err);
            else
                console.log("Message sent: " + res.envelope.to);
            
            smtpTransport.close();
        });
    });
}
