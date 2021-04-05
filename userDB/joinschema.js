const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    discordID: String,
    attempts: Number,
    joinDate: String
});

module.exports = mongoose.model("Users", userSchema);