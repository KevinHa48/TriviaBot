const cmdusg = require("../data/command_usage.json")

module.exports = {
    name: 'commands',
    description: 'Display command usage.',
    execute(message, args) {
        message.author.send({ embed: cmdusg });
    }
}