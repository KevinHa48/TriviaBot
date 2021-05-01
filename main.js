/******************************************************
 * How to run the Trivia Bot:
 * 1. Make sure node.js is installed
 * 2. Run using nodemon, npm install -g nodemon first.
******************************************************/
/******************************************************
 * TODO:
 * 1. Clean up this gross code
 * 2. Figure out how to implement multi-rounds.
 * 3. Error checking.
******************************************************/

const Discord = require("discord.js");
const fs = require('fs');
const mongo = require('./userDB/mongo')
const cmdusg = require("./data/command_usage.json");
const s_data = require('./data/server_data.json');
const Users = require("./userDB/join_schema.js");

require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const prefix = "!";


client.on("ready", async () => {
    console.log("Trivia Bot is now online!"); 

    let db = await mongo();
    if (db) console.log("Successfully connected to mongo!");
    
});

module.exports = { client };

for(const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", async message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length);
    const input = commandBody.trim().split(/ +/);
    const command = input.shift().toLowerCase();
    const args = input.join('').toLowerCase();

    // Regex, purge all non-alphanumeric.
    const clean_args = args.replace(/[^A-Za-z0-9]/g, "");

    try {
      await client.guilds.cache.get(s_data.guild_id).members.fetch(message.author.id);
    } catch {
      message.author.send(`You are not in the CPAC Discord Server. Make sure you're in the server if you want to play!`);
      return;
    }

    if(!client.commands.has(command)) {
      message.author.send(`Couldn't understand your command, make sure you didn't misspell anything!`)
      message.author.send({ embed: cmdusg });
      return;
    }

    try {
      client.commands.get(command).execute(message, clean_args);
    } catch (error) {
      console.error(error);
    }
    
});

client.login(process.env.TOKEN);
