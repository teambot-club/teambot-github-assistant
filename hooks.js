module.exports = function (hookBody, controller, bot, callback) {
    if (!hookBody.review || hookBody.review.state !== "approved") {
        return callback("Skipped. Processing only Approved Github Pull Request.");
    }
    
    var prOwner = hookBody.pull_request.user.login;
    var prOwnerSlackUsername = null;
    controller.storage.users.all(function (err, users) {
        for (var i in users) {
            if(users[i].githubUsername === prOwner) {
                prOwnerSlackUsername = users[i].id;
                break;
            }
        }

        if (!prOwnerSlackUsername) {
            return callback("Skipped. Cannot find a slack user associated with the Github Pull Request owner.");
        }

        var targetUser = bot.api.users.info({ "user" : prOwnerSlackUsername }, function (err, result) {
            bot.api.chat.postMessage({
                    "channel": '@' + result.user.name,
                    "as_user": true,
                    "attachments": [{
                        color: "warning",
                        title: "Your '" + hookBody.pull_request.title + "' pull request was just Approved! ",
                        title_link: hookBody.review.html_url,
                        callback_id: "teambot-local",
                        attachment_type: 'default',
                        actions: [
                            {
                                "name":"merge",
                                "text": "Merge",
                                "value": "merge",
                                "type": "button"
                            },
                            {
                                "name":"close",
                                "text": "Close",
                                "value": "close",
                                "type": "button"
                            }
                    ]
                }]
            }, function (error) {
                return callback("Unable to get user info from slack: '" + error + "'");
            });

            return callback();
        }, function (error) {
            return callback("Unable to post message to slack: '" + error + "'");
        });
    });
};