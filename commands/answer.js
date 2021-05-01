/**
 * Merge join and answer command.
 * Utilize join.js.
 * Please fix this else if chain, this is not pretty at all..
 */

const Users = require("../userDB/join_schema.js");
const Controller = require("./controller.js");
const leave = require("./leave.js");
const join = require("./join.js");

module.exports = {
  name: 'answer',
  description: 'Handles the answer command.',
  async execute(message, args) {
    if (message.channel.type === 'dm') {
      //Helpful tip: find returns array, findOne returns single json object!!
      const participant = await Users.findOne({ discordID: message.author.id });
      console.log(args);
      console.log("User attempted to answer question.");

      if (!participant) {
        message.author.send('It looks you haven\'t joined yet. Type `!join` to enter.');
        return;
      }

      else if(!participant.joinStatus || !(await join.checkRole(message.author.id))) {
        message.author.send('You have left the game. Type `!join` to re-enter.');
        return;
      }

      else if (Controller.getTriviaStatus()) {
        message.author.send(`Quick on the Trigger has ended for today. Thanks for playing!`);
        return;
      }
      
      else if (!Controller.getTriviaStatus() && (Controller.getAnswer().length === 0)) {
        message.author.send(`Quick on the Trigger hasn't started yet, get ready for the questions!`);
        return;
      }

      else if (participant.attempts == 0) {
        message.author.send(`You reached the maximum attempts allowed.`);
        return;
      }

      else if (participant.answered) {
        if (Controller.getIndex() === 12) {
          message.author.send('That was the last question of the day. The event will resume tomorrow morning at 10 AM EDT.');
        } else if (Controller.getIndex() === Controller.getLength()) {
          message.author.send('That was the last question of the event, thanks for playing! The winners will be announced shortly after the end of the hour!');
        } else {
          message.author.send(`You already answered correctly, sit tight for the next question!`);
        }
        return;
      }

      else if (Controller.getAnswer().includes(args)) {
        if (Controller.getIndex() === 12) {
          message.author.send('Correct! That was the last question of the day. The event will resume tomorrow morning at 10 AM EDT.');
        } else if (Controller.getIndex() === Controller.getLength()) {
          message.author.send('Correct! That was the last question of the event, thanks for playing! The winners will be announced shortly after the end of the hour!');
        } else {
          message.author.send(`Correct! Keep an eye on the next question!`);
        }
        participant.score++;
        participant.answered = true;
      }

      else {
        participant.attempts--;
        if(participant.attempts == 0) {
          if (Controller.getIndex() === 12) {
            message.author.send('Incorrect. That was the last question of the day. The event will resume tomorrow morning at 10 AM EDT.');
          } else if (Controller.getIndex() === Controller.getLength()) {
            message.author.send('Incorrect. That was the last question of the event, thanks for playing! The winners will be announced shortly after the end of the hour!');
          } else {
            message.author.send(`Incorrect. You have used all of your attempts, better luck on the next question!`);
          }
        }
        else {
          message.author.send('Incorrect, try again.\nYou have `' + participant.attempts + '` attempts left!');
        }
      }

      await participant.save();
    }
  }
}