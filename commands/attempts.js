const Users = require("../userDB/join_schema.js");

module.exports = {
    name: 'attempts',
    description: 'Grabs the requested attempts of the user.',
    async execute(message, args) {
        const requested = await Users.findOne({ discordID: message.author.id });
        message.author.send("Attempts remaining for the question: " + "`" + requested.attempts + "`");
        return;
    }
}