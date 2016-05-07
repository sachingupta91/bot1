var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'YourAppId', appSecret: 'YourAppSecret' });
bot.add('/', new builder.CommandDialog()
    .matches('^game', builder.DialogAction.beginDialog('/gameSelection'))
    .matches('^playgame', builder.DialogAction.beginDialog('/gameSelection'))
	.matches('^changegame', builder.DialogAction.beginDialog('/gameSelection'))
    .matches('^quit', builder.DialogAction.endDialog())
    .onDefault(function (session) {
        if (!session.userData.currentSelectedGame) {
            session.beginDialog('/gameSelection');
        } else {
            session.beginDialog('/guessMyName');
        }
    }));


bot.add('/gameSelection',  [
    function (session) {
        if (session.userData.currentSelectedGame) {
            builder.Prompts.text(session, 'What would you like to change it to?');
        } else {
            builder.Prompts.text(session, 'Hi! Do you want to play guess my name?');
        }
    },
    function (session, results) {
		if(results.response)
		{
           session.userData.currentSelectedGame = 'guessmyname';
		}
        session.endDialog();
    }
]);
	
bot.add('/guessMyName',  [
    function (session) {
        builder.Prompts.text(session, 'What is my name (Guess)?');
    },
    function (session, results) {
		if(results.response === 'quit')
		{
			session.endDialog();
			return;
		}
		if(results.response === 'saching')
		{
           session.send('You are correct. Now i recognize you..');
		}
		else{
			session.send('Sorry!!! You are wrong. Try again..');
		}
        session.endDialog();
		session.beginDialog('/guessMyName');
    }
]);

/*
bot.add('/', new builder.CommandDialog()
    .matches('^set name', builder.DialogAction.beginDialog('/profile'))
    .matches('^quit', builder.DialogAction.endDialog())
    .onDefault(function (session) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            session.send('Hello %s!', session.userData.name);
        }
    }));
bot.add('/profile',  [
    function (session) {
        if (session.userData.name) {
            builder.Prompts.text(session, 'What would you like to change it to?');
        } else {
            builder.Prompts.text(session, 'Hi! What is your project Group name?');
        }
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);
*/

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});