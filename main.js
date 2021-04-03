/******************************************************
 * How to run the Trivia Bot:
 * 1. Make sure node.js is installed
 * 2. Run using nodemon, npm install -g nodemon first.
******************************************************/

const Discord = require("discord.js");
const helpmsg = require("./helpmessage.json")
const qbank = require("./triviaquestions.json")
const mongo = require('./mongo')
//const cron = require('cron');

require('dotenv').config();

const client = new Discord.Client();
const prefix = "!";
var i = 0;
var controller;
var join_status = true;
var current_answer;
var answered = false;

client.on("ready", async () => {
    console.log("Trivia Bot is now online!"); 

    await mongo().then(mongoose => {
      try {
        console.log('Successfully connected to mongo!');
      } finally {
        mongoose.connection.close();
      }
    })
    
});


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
//We might have to use CRON if we want to have greater control of when the bot sends out the questions.

// let scheduledTrivia = new cron.CronJob('*/2 * * * *', () => {
//   client.channels.cache.get('826315775111200848').send(`This test message will be sent every 2 minutes using node-cron.`)
// });


client.on("message", message => {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) {
      if(message.channel.type === 'dm' && join_status && !answered) {
        console.log("User attempted to answer question.")
        if(message.content == current_answer) {
          message.author.send(`Correct!`);
          answered = true;
        } else {
          message.author.send(`Incorrect, try again.`);
        }
      }
      else if (answered) {
        message.author.send(`You already answered correctly, sit tight for the next question!`)
        return;
      }
      else {
        message.author.send(`It looks like you haven't joined using the !join command.`);
        return;
      }
    }

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "help") {
      setTimeout(() => message.delete(), 3000);
      message.author.send({ embed: helpmsg });
    }

    /* Admin Commands Only */
    // Command must be made inside server only.
    if(message.guild) {
      var perm_check = message.member.roles.cache.has('827662867171901481');

      if (perm_check && (command === "start") ) {
        message.delete();
        console.log("Warning: Used an admin command!!!");
        controller = setInterval(sendTrivia, 20000);
        console.log("Started trivia controller.");
      }
  
      if (perm_check && (command === "stop") ) {
        message.delete();
        console.log("Warning: Used an admin command!!!");
        clearInterval(controller);
        console.log("Stopped trivia controller.");
      }
    }
    
  
    

});

client.login(process.env.TOKEN);
