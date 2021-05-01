const Users = require("../userDB/join_schema.js");

module.exports = {
    name: 'attempts',
    description: 'Grabs the requested attempts of the user.',
    async execute(message, args) {
        const requested = await Users.findOne({ discordID: message.author.id });
        if(!requested) {
            message.author.send('It looks you haven\'t joined yet. Type `!join` to enter.');
            return;
        }
        message.author.send("Attempts remaining for the question: " + "`" + requested.attempts + "`");
        return;
    }
}