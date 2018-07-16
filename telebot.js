var TeleBot = require("telebot");

exports.sendBotMessages = function (posts) {
    const bot = new TeleBot('434565676:AAGcOxN2yQHiBfl2r0j0bNIHFpfN1iXS7hA');
    // https://api.telegram.org/bot434565676:AAGcOxN2yQHiBfl2r0j0bNIHFpfN1iXS7hA/sendMessage?chat_id=@dolvenNoti&text=123
    if (posts) {
        posts.forEach(function (post, index, array) {
            bot.sendMessage('@dolvenNoti', post.postTitle + '\n' + post.postUrl);
        });
    }
    else {
        console.log("no post");
    }
};
