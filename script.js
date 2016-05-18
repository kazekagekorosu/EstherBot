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
                var messages = [ "Sorry. I'm not smart enough to understand that. type in HELP to see a couple of things I understand",
                                 "Hey, sorry, I didn't understand you. Type in HELP and I'll let you know what I can do",
                                 "One day.",
                                 "I'm not that clever yet. Try HELp",
                                 "I'm Kiri, I'm responsive to certain words only at the moment. You have to ask something that I understand. :) Type HELP to get a short list of things I understand",
                                 "The KiriBot is not a human. It is just a cute chatbot. Text HELP to learn more.",
                                 "Seriously, you are wayyyyy smarter than me. I just knows simple stuff, type HELP to see what I kind of know ",
                                 "Well, I don't know about that, trying Saying HELLO",
                                 "There is a little bit of information in KiriBot, I'm getting a little smarter each day. You have to use HELP to find out what I know.",
                                 "That's interesting. Hhhmmm... I never thought of that. Type HELP, and I'll let you see what I kind of know",
                                 "Can you say HELP",
                                 "Ummm...I sometimes get confused, that happens from time to time. Try HELP to see what I understand",
                                 "That is a ton of words you just wrote there... I really don't know many of them. Type HELP to see what I can understand",
                                 "Right now, lots of things make me confused. Type HELLO or Hi or HELP",
                                 "Ouch, I'm not too smart yet, try HELP, for a short list of what I can talk about",
                                 "I'm cool, but not that cool, I can understand somethings, like HELLO, or Ni Hao, or Kia Ora or Help...standard stuff, some sentences too, but they have to be exact! Tricky I know."
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
