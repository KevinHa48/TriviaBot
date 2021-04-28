const helpmsg = require("../data/help_message.json")

module.exports = {
    name: 'help',
    description: 'Simple help command.',
    execute(message, args) {
        message.author.send({ embed: helpmsg });      
    }
}