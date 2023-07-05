// Require modules
/*--------------------------------------------------------------- */
const express = require('express')
const router = express.Router()


// Require the db connection
/*--------------------------------------------------------------- */
const db = require('../models')


// Routes
/*--------------------------------------------------------------- */
// Index Route GET Will display all posts
router.get('/', function (req, res) {
    db.Post.find({})
        .then(posts => res.render('post/post-index', {posts: posts}))
})

// New Route GET Will render form for new post
router.get('/new', function (req, res){
    res.render('post/new-post')
})

// Show Route GET Will display individual post document
router.get('/:id', function (req, res) {
    db.Post.findById(req.params.id)
        .then(post => res.render('post/post-details',{post: post}))
        .catch(() => res.render('404'))
})

// Edit Route GET Will render form for editing post
router.get('/:id/edit', (req, res) => {
    db.Post.findById(req.params.id)
        .then(post => {
            res.render('post/edit-post', {post: post})
        })
        
})

// Update Route PUT Receives the PUT request sent from the edit route, and redirects the user back to the show page for the updated post.
router.put('/:id', (req, res) => {
    db.Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
        .then(post => res.redirect('/posts/'+ post._id))
})

// Destroy Route DELETE Route deletes a post document
router.delete('/:id', (req, res) => {
    db.Post.findByIdAndRemove(req.params.id)
        .then(post => res.redirect('/posts'))
})

// Create Route POST Recieves POST request from new route, creates new post and redirects to post index page
router.post('/', function (req, res){
    db.Post.create(req.body)
        .then(post => res.redirect('/posts'))
})

// Export routes so they are accessible in server.js
/*--------------------------------------------------------------- */
module.exports = router
