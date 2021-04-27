const qbank = require("../data/trivia_questions.json")
const { client } = require('../main.js')
var i = 0;
var current_answer;

function sendTrivia() {
    if(i == qbank.trivia_bank.length) {
      return;
    }
    else {
      client.channels.cache.get('826315775111200848').send(`Question: ${qbank.trivia_bank[i].question}`, 
      {files: [`${qbank.trivia_bank[i].image}`]});
      current_answer = qbank.trivia_bank[i].answer;
      i++;
    }
    
  }

module.exports = {
    name: 'controller',
    description: 'Admin only: Controller for Questions.',
    execute(message, args) {
        if(message.guild) {
            let perm_check = message.member.roles.cache.has('827662867171901481');
            let controller;
      
            if (perm_check && (args === "start") ) {
              message.delete();
              console.log("Warning: Used an admin command!!!");
              controller = setInterval(sendTrivia, 20000);
              console.log("Started trivia controller.");
            }
        
            if (perm_check && (args === "stop") ) {
              message.delete();
              console.log("Warning: Used an admin command!!!");
              clearInterval(controller);
              console.log("Stopped trivia controller.");
            }
        }
    }

}