const s_data = require('../data/server_data.json');
const { client } = require('../main.js');
const Users = require("../userDB/join_schema.js");

async function removeRole(message, user_id) {
    const member = await client.guilds.cache.get(s_data.guild_id)
    .members.fetch(user_id);
    const usr = await Users.findOne({discordID: message.author.id});
    if( member.roles.cache.has(s_data.role_id) ) {
        usr.joinStatus = false;
        message.author.send('You have left the game! You will not be pinged by the bot anymore.\n'
        + 'Your scores are still saved, so feel free to join back anytime with the `!join` command.\n' + 
        'If you are still getting pings from the bot, please let the staff know. Thanks for playing!');
        await member.roles.remove(s_data.role_id);
        await usr.save();
        return;
    }
    if(usr) {
        console.log('e');
        usr.joinStatus = false;
        await usr.save();
    }
    message.author.send('You are not currently in the game! Type `!join` to enter'); 
}


module.exports = {
    name: 'leave',
    description: 'Removes the QoT role from the requested user.',
    async execute(message, args) {
        await removeRole(message, message.author.id);
    }
}