/**
 * Use this only when something terribly goes wrong or for testing only.
 * This won't remove entries, but reset the scores.
 */

const Users = require("../userDB/join_schema.js");
const cmdusg = require("../data/command_usage.json");

const resetUsers = async (fullReset = false) => {
    await Users.find({}, (err, usr) => {
        if (err) {
            console.log(err);
            return;
        }
        usr.map(entry => {
            entry.attempts = 3;
            if(fullReset) {entry.score = 0};
            entry.answered = false;
            entry.save();
        })
    })
    if(!fullReset) { console.log("Successfully reset all users for the next question"); }
}
const s_data = require('../data/server_data.json');

module.exports = {
    name: 'reset',
    description: 'Admin / Controller Only: Resets the user entries.',
    resetUsers,
    async execute(message, args) {
        if(!(message.channel.type === 'dm') && message.member.roles.cache.has(s_data.admin_id)) {
            console.log("Warning: Hard reset requested...");
            await resetUsers(true);
            message.author.send('Successfully hard resetted the database.')
        }
        else {
            // haha funny way to disguise an admin command xdddd
            message.author.send("Sorry! Couldn't recognize that command. Check the commands below for help.");
            message.author.send({ embed: cmdusg });
        }
       
    }
}