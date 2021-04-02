/******************************************************
 * How to run the Trivia Bot:
 * 1. Make sure node.js is installed
 * 2. Run using nodemon, npm install -g nodemon first.
******************************************************/

const Discord = require("discord.js");
const helpmsg = require("./helpmessage.json")
const qbank = require("./triviaquestions.json")
//const cron = require('cron');

require('dotenv').config();

const client = new Discord.Client();
const prefix = "!";
var i = 0;

client.on("ready", () => {
    console.log("Trivia Bot is now online!"); 

    //Sends question every 5 seconds, put it in ready for now to test.
    //require converts json file to JS object already, just need to parse it for it's question and filename.
    // var q = setInterval(() => {
    //   client.channels.cache.get('826315775111200848').send(`Question: ${qbank.trivia_bank[i].question}`, 
    //   {files: [`${qbank.trivia_bank[i].image}`]});
    //   i++;
    //   if(i == qbank.trivia_bank.length) {clearInterval(q)};
    // }, 5000);

});


function sendTrivia() {
  if(i == qbank.trivia_bank.length) {
    clearInterval(q);
  }
  else {
    i++;
    client.channels.cache.get('826315775111200848').send(`Question: ${qbank.trivia_bank[i].question}`, 
    {files: [`${qbank.trivia_bank[i].image}`]});
  }
  
}
//We might have to use CRON if we want to have greater control of when the bot sends out the questions.

// let scheduledTrivia = new cron.CronJob('*/2 * * * *', () => {
//   client.channels.cache.get('826315775111200848').send(`This test message will be sent every 2 minutes using node-cron.`)
// });


client.on("message", message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "help") {
      message.author.send({ embed: helpmsg });
    }

    /* Admin Commands Only */
    // Command must be made inside server only.
    if(message.guild) {
      var perm_check = message.member.roles.cache.has('827662867171901481');

      if (perm_check && (command === "start") ) {
        controller = setInterval(sendTrivia, 5000);
      }
  
      if (perm_check && (command === "stop") ) {
        console.log("Warning: Used an admin command!!!");
      }
    }
    
  
    

});
client.login(process.env.TOKEN);
