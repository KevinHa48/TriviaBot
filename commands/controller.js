const qbank = require("../data/trivia_questions.json");
const { resetUsers } = require("./reset.js");
const { generateEmbed } = require("../extra_functions/embed.js");
const { client } = require('../main.js');
const s_data = require('../data/server_data.json');
const cmdusg = require("../data/command_usage.json");

let i = 0;
let current_answer;
let controller;
let triviaEnded = false;

async function sendTrivia() {
    if(i == qbank.trivia_bank.length) {
      triviaEnded = true;
      console.log("Trivia has ended.");

      client.channels.cache.get(s_data.question_channel)
      .send(`<@&${s_data.role_id}> Quick on the Trigger has ended for today. Winners will be DM'd. Thanks for playing!`);
      
      clearInterval(controller);
      return;
    }
    else {
      client.channels.cache.get(s_data.question_channel).send(`<@&${s_data.role_id}>`);

      client.channels.cache.get(s_data.question_channel)
        .send(generateEmbed(qbank.trivia_bank[i].imagePath, 
                            qbank.trivia_bank[i].image, 
                            qbank.trivia_bank[i].id, 
                            qbank.trivia_bank[i].question));
      await resetUsers();
      current_answer = ((qbank.trivia_bank[i].answer).split(' ').join('')).toLowerCase(); 
      console.log(current_answer);
      i++;
    }    
}

function getAnswer() {
    return current_answer;
}

function getTriviaStatus() {
    return triviaEnded;
}

function getIndex() {
  return i;
}

function getLength() {
  return qbank.trivia_bank.length;
}

module.exports = {
    name: 'controller',
    description: 'Admin only: Controller for Questions.',
    getAnswer,
    getTriviaStatus,
    getIndex,
    getLength,
    execute(message, args) {
        if(message.guild) {
            let perm_check = message.member.roles.cache.has(s_data.admin_id);
      
            if (perm_check && (args === "start") ) {
              message.delete();
              console.log("Warning: Used an admin command!!!");
              message.author.send('Warning: Started the trivia controller.')
              sendTrivia();
              controller = setInterval(sendTrivia, 300000);
              console.log("Started trivia controller.");
            }
        
            if (perm_check && (args === "stop") ) {
              message.delete();
              console.log("Warning: Used an admin command!!!");
              message.author.send('Warning: Stopped the trivia controller.')
              clearInterval(controller);
              console.log("Stopped trivia controller.");
            }
        }
        else {
          message.author.send("Couldn't understand your command, make sure you didn't misspell anything!");
          message.author.send({ embed: cmdusg });
        }
    }

}