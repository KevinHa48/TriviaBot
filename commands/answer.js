/**
 * Merge join and answer command.
 * Utilize join.js.
 */

const Users = require("../userDB/join_schema.js");
const Controller = require("./controller.js");

module.exports = {
    name: 'answer',
    description: 'Handles the answer command.',
    async execute(message, args) {
        if (message.channel.type === 'dm') {
            //Helpful tip: find returns array, findOne returns single json object!!
            const participant = await Users.findOne({discordID: message.author.id});
            console.log(args);
            console.log("User attempted to answer question.");
      
            if (!participant.joinStatus) {
              message.author.send(`It looks you haven't joined yet. Type !join to enter.`);
              return;
            }
      
            else if (participant.attempts == 0) {
              message.author.send(`You reached the maximum attempts allowed.`);
              return;
            }
      
            else if (participant.answered) {
              message.author.send(`You already answered correctly, sit tight for the next question!`);
              return;
            }
      
            else if (args == Controller.getAnswer()) {
              message.author.send(`Correct! Keep an eye on the next question!`);
              participant.score++;
              participant.answered = true;
            }
      
            else {
              console.log(global.current_answer);
              message.author.send(`Incorrect, try again.`);
              participant.attempts--;
              //console.log(participant.attempts);
            }

            await participant.save();
        }
    }
}