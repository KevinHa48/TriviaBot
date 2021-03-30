const Discord = require("discord.js");
const helpmsg = require("./helpmessage.json")
const cron = require('cron');

require('dotenv').config();

const client = new Discord.Client();
const prefix = "!";

client.on("ready", () => {
    console.log("Trivia Bot is now online!")  
});

let scheduledTrivia = new cron.CronJob('*/2 * * * *', () => {
  client.channels.cache.get('826315775111200848').send(`This test message will be sent every 2 minutes using node-cron.`)
});

client.on("message", message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "help") {
      message.author.send({ embed: helpmsg });
    }

    if (command === "start") {
      message.author.send("Started Cron Job.")
      scheduledTrivia.start();
    }

    if (command === "stop") {
      message.author.send("Stopped Cron Job.")
      scheduledTrivia.stop();
    }

    

});
client.login(process.env.TOKEN);
