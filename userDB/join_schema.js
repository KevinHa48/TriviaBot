const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    discordID: {type: String, unique: true},
    attempts: Number,
    score: Number,
    joinStatus: Boolean,
    answered: Boolean,
    joinDate: String
});

module.exports = mongoose.model("Users", userSchema);