require('dotenv').config();

const mongoose = require('mongoose');

module.exports = async () => {
    await mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error'));
    db.once('open', function() {
        // we're in
    });
    return db;
}