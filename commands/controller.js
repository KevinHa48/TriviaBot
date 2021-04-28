const qbank = require("../data/trivia_questions.json");
const { resetUsers } = require("./reset.js");
const { client } = require('../main.js');

let i = 0;
let current_answer;
let controller;

async function sendTrivia() {
    if(i == qbank.trivia_bank.length) {
      console.log("Trivia has ended.");
      clearInterval(controller);
      return;
    }
    else {
      client.channels.cache.get('826315775111200848').send(`Question: ${qbank.trivia_bank[i].question}`, 
      {files: [`${qbank.trivia_bank[i].image}`]});
      await resetUsers();
      current_answer = qbank.trivia_bank[i].answer;
      i++;
    }    
}

function getAnswer() {
    return current_answer;
}

module.exports = {
    name: 'controller',
    description: 'Admin only: Controller for Questions.',
    getAnswer,
    execute(message, args) {
        if(message.guild) {
            let perm_check = message.member.roles.cache.has('827662867171901481');
      
            if (perm_check && (args === "start") ) {
              message.delete();
              console.log("Warning: Used an admin command!!!");
              controller = setInterval(sendTrivia, 15000);
              console.log("Started trivia controller.");
            }
        
            if (perm_check && (args === "stop") ) {
              message.delete();
              console.log("Warning: Used an admin command!!!");
              clearInterval(controller);
              console.log("Stopped trivia controller.");
              return;
            }
        }
    }

}