// Require the Mongoose package and .env
const mongoose = require('mongoose');
require('dotenv').config()

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODBURI);
const db = mongoose.connection

db.on('connected', function () {
    console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
});

module.exports = {
    Post: require('./post'),
    seedPost: require('./seed')
}