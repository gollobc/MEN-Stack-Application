//Require Mongoose package
const mongoose = require('mongoose');
const commentSchema = require('./comment.js')

//Create schema for user posts
const postSchema = new mongoose.Schema({
    name: {type: String, default: 'User'},
    content: {type: String, required: true},
    postDate: {type: Date, default: Date.now},
    comments: [commentSchema]
})

module.exports = mongoose.model('Post', postSchema)
