module.exports = function (buttonsGroup, message, controller, bot) {
        var color = message.actions[0].value === "merge" ? "good" : "danger";
        var text = message.actions[0].value === "merge" ? "Your pull request was successfully Merged!" : "Your pull request was Closed!";
        var reply = {
            attachments: [{
                    color: color,
                    title: message.original_message.attachments[0].title,
                    title_link: message.original_message.attachments[0].title_link,
                    text: text,
            }],
        }

        bot.replyInteractive(message, reply);
};