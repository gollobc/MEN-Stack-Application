// Require modules
/*--------------------------------------------------------------- */
const express = require('express')
const router = express.Router()


// Require the db connection
/*--------------------------------------------------------------- */
const db = require('../models')


// Routes
/*--------------------------------------------------------------- */
// Index Route GET /comments/
router.get('/', (req, res) => {
	db.Post.find({}, { comments: true, _id: false })
        .then(posts => {
	    	const flatList = []
	    	for (let post of posts) {
	        	flatList.push(...post.comments)
	    	}
	    	res.render('comment/comment-index', {comments:flatList})
		}
	)
});

// New Route: GET /comments/new
router.get('/new/:postId', (req, res) => {
    db.Post.findById(req.params.postId)
        .then(post => {
            res.render('comment/new-comment', {post: post})
        })
})

// Create Route: POST /comments/
router.post('/create/:postId', (req, res) => {
    db.Post.findByIdAndUpdate(
        req.params.postId,
        { $push: { comments: req.body } },
        { new: true }
    )
        .then(() => res.redirect('/posts/' + req.params.postId))
});

// Show Route: GET /comments/:id
router.get('/:id', (req, res) => {
    db.Post.findOne(
        { 'comments._id': req.params.id },
        { 'comments.$': true, _id: false }
    )
        .then(post => {
            res.render('comment/comment-details', {comment: post.comments[0]})
        })
});

// Destroy Route: DELETE /comments/:id
router.delete('/:id', (req, res) => {
    db.Post.findOneAndUpdate(
        { 'comments._id': req.params.id },
        { $pull: { comments: { _id: req.params.id } } },
        { new: true }
    )
        .then(post => res.redirect('/posts/' + post._id))
});


// Export routes so they are accessible in server.js
/*--------------------------------------------------------------- */
module.exports = router
