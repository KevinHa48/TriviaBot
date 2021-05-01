const helpmsg = require("../data/help_message.json")

module.exports = {
    name: 'help',
    description: 'Simple help command.',
    execute(message, args) {
        const date = new Date();
        if(date.getDay() == 6) {
            console.log('e');
        }
        message.author.send({ embed: helpmsg });      
    }
}