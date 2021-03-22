const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();
const prefix = "!";

client.on("message", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`a, Latency ${timeTaken}ms.`);
    }
    
    /*
    if(message.channel.type = "dm") {
       message.author.send("Talking to you via DM.");
    }
    else {
        
    }
    */
});
client.login(config.BOT_TOKEN);
console.log("Trivia Bot is now online!")