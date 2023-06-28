//Require Mongoose package
const mongoose = require('mongoose');

//Create schema for comments
const commentSchema = new mongoose.Schema({
    name: {type: String, default: 'User'},
    content: {type: String, required: true},
    date: {type: Date, default: Date.now}
})

module.exports = commentSchema;