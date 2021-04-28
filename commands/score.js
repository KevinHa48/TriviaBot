const Users = require("../userDB/join_schema.js");

module.exports = {
    name: 'score',
    description: 'Grabs the requested score of the user.',
    async execute(message, args) {
        const requested = await Users.findOne({ discordID: message.author.id });
        message.author.send("Your current score is: " + "`" + requested.score + "`");
        return;
    }
}