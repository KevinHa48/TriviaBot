const Discord = require('discord.js');

function generateEmbed(path, file, id, question) {
    const attachment = new Discord.MessageAttachment(path, file);
    const questionEmbed = new Discord.MessageEmbed()
        .setTitle('Question #' + id)
        .setColor('#FF0000')
        .setDescription(question)
        .attachFiles(attachment)
        .setImage('attachment://'+ file);

    return questionEmbed;
}

module.exports = { generateEmbed }