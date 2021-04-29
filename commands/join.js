const Users = require("../userDB/join_schema.js");
const { client } = require('../main.js');
const s_data = require('../data/server_data.json');
const leave = require('./leave.js');

let member;

async function addRole(user_id) {
    member = await client.guilds.cache.get(s_data.guild_id)
    .members.fetch(user_id);

    await member.roles.add(s_data.role_id);
}

async function checkRole(user_id) {
    member = await client.guilds.cache.get(s_data.guild_id)
    .members.fetch(user_id);

    if(member.roles.cache.has(s_data.role_id)) {
        return true;
    }

    return false;
}

module.exports = {
    // Take note, node will not warn you of misspellings here, please be careful.
    name: 'join',
    description: 'Command to handle join command',
    async execute(message, args) {
       /**
        * Mongoose has it's own functions for query.
        * You cannot use some querying functions provided in normal MongoDB
        * Remember Mongoose is an abstraction of MongoDB
        * It is different from the native Node.js driver of MongoDB!!!!
        */

        await Users.find({discordID: message.author.id}, (err, usr) => {
            if(err) {
                console.log(err);
                return;
            }
            if(usr.length) {
                console.log("User already in database attempted to join.")
                checkRole(message.author.id)
                    .then(hasRole => {
                        if(hasRole) {
                            message.author.send('You already joined! If you\'re confused on how to answer, use `!commands`.');
                            return;
                        }
                        leave.setLeaveStatus(false);
                        message.author.send(`Welcome back to Quick on the Trigger! You are now able to answer again!`);
                    })
                return;
            }
            else {
                const user = new Users({
                    username: message.author.tag,
                    discordID: message.author.id,
                    attempts: 3,
                    score: 0,
                    joinStatus: true,
                    answered: false,
                    joinDate: message.createdAt
                });
                user.save()
                    .then(result => {
                        console.log(result);
                        message.author.send(`Successfully joined! Good luck!`);
                    })
                    .catch(err => {
                        console.log(err);
                        message.author.send(`Could not save user entry.`);
                        return;
                    });
            }
        })
        // For now, adds role anyway..
        await addRole(message.author.id);
    }
}