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
let ans_arr = [];

async function sendTrivia() {
    if(i == qbank.trivia_bank.length) {
      triviaEnded = true;
      console.log("Trivia has ended.");
      const date = new Date();
      if(date.getDay() == 6) {
        client.channels.cache.get(s_data.question_channel)
        .send(`<@&${s_data.role_id}> Quick on the Trigger has ended for today. Check back tomorrow at 10 AM EDT!`);
        clearInterval(controller);
        return;
      }
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
      ans_arr.length = 0;
      qbank.trivia_bank[i].answer.forEach(ans => {
        ans_arr.push(ans.split(' ').join('').toLowerCase().replace(/[^A-Za-z0-9]/g, ""));
      });
      console.log(ans_arr);
      i++;
    }    
}

function getAnswer() {
    return ans_arr;
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
              controller = setInterval(sendTrivia, 5000);
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