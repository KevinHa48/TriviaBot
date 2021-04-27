const Users = require("../userDB/join_schema.js");

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
                message.author.send(`You already joined!`);
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
                        console.log(result)
                        message.author.send(`Successfully joined! Good luck!`)
                    })
                    .catch(err => {
                        console.log(err);
                        message.author.send(`Error joining, try again in a bit.`)
                    });
            }
        })
    }
}