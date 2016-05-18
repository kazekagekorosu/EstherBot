'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('Hi. This is Kiribot. Send a message to get started.')
                .then(() => 'speak');
        }
    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }


/* getReply should allow for some variety in responses for received text messages that 
do not have an entry in the scripts.json file. */
            function getReply() {
                var messages = [ "Sorry. I'm not configured with a response to your message. Text HELP to see a few examples.",
                                 "Hey, I didn't understand that. I suggest saying HELP",
                                 "One day.",
                                 "I'm not that clever yet. Try HELp",
                                 "The program responds to COMMANDS only. You have to send a command that I understand. :)",
                                 "The KiriBot is not a human. It is just a cute chatbot. Text HELP to learn more.",
                                 "Seriously, you are wayyyyy smarter than KiriBot. It just knows simple stuff, HELP",
                                 "Yo. I do not know what you are talking about. Send me a HELLO",
                                 "There is a ton of information in KiriBot. You have to use HELP to find it.",
                                 "That's interesting. Hhhmmm... I never thought of that. Maybe try HELP",
                                 "Can you say HELP",
                                 "Yeah... that happens from time to time. Try HELP",
                                 "That is a ton of words you just wrote there... I really don't know. Try HELP",
                                 "Right now, punctuation throws me off. Send text without it. Try HELP",
                                 "Ouch, I'm not too smart yet, try HELP, for a short list of what I can talk about",
                                 "I'm not programmed to ignore punctuation. So if you're sending something other than letters... I don't understand it."
                                ];

                var arrayIndex = Math.floor( Math.random() * messages.length );


                return messages[arrayIndex];
                
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

/* remove the text in between the () after bot.say and place the function getReply() */

                if (!_.has(scriptRules, upperText)) {
                    return bot.say( getReply() ).then( () => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
