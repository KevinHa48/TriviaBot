const s_data = require('../data/server_data.json');
const { client } = require('../main.js');
let leaveStatus = false;

function getLeaveStatus() {
    return leaveStatus;
}

function setLeaveStatus(status) {
    leaveStatus = status;
    return;
}

async function removeRole(message, user_id) {
    const member = await client.guilds.cache.get(s_data.guild_id)
    .members.fetch(user_id);
   
    if( member.roles.cache.has(s_data.role_id) ) {
        leaveStatus = true;
        message.author.send('You have left the game! You will not be pinged by the bot anymore.\n'
        + 'Your scores are still saved, so feel free to join back anytime with the `!join` command. Thanks for playing!');
        await member.roles.remove(s_data.role_id);
        return;
    }
    message.author.send('You have already left the game or you never joined yet! Type `!join` to re-enter/enter\n'
    + 'If you are still getting pinged for some reason, please let the staff know!'); 
}


module.exports = {
    name: 'leave',
    description: 'Removes the QoT role from the requested user.',
    getLeaveStatus,
    setLeaveStatus,
    async execute(message, args) {
        await removeRole(message, message.author.id);
    }
}