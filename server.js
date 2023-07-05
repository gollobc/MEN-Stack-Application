// Require modules
/*--------------------------------------------------------------- */
require('dotenv').config()
const path = require('path');
const express = require('express');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const methodOverride = require('method-override');



// Require the db connection, models, and seed data
/*--------------------------------------------------------------- */
const db = require('./models');

// Require the routes in the controllers folder
/*--------------------------------------------------------------- */
const postCtrl = require('./controllers/posts');
const commentCtrl = require('./controllers/comments');


// Create the Express app
/*--------------------------------------------------------------- */
const app = express();


// Configure the app (app.set)
/*--------------------------------------------------------------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware (app.use)
/*--------------------------------------------------------------- */
// Detect if running in a dev environment
if (process.env.ON_HEROKU === 'false') {
    // Configure the app to refresh the browser when nodemon restarts
    const liveReloadServer = livereload.createServer();
    liveReloadServer.server.once("connection", () => {
        // wait for nodemon to fully restart before refreshing the page
        setTimeout(() => {
        liveReloadServer.refresh("/");
        }, 100);
    });
    app.use(connectLiveReload());
}

// Body parser: used for POST/PUT/PATCH routes: 
// this will take incoming strings from the body that are URL encoded and parse them 
// into an object that can be accessed in the request parameter as a property called body (req.body).
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
// Allows us to interpret POST requests from the browser as another request type: DELETE, PUT, etc.
app.use(methodOverride('_method'));




// Mount routes
/*--------------------------------------------------------------- */
app.get('/', function (req, res) {
    res.render('home')
});

app.get('/seed', function (req, res) {
    db.Post.deleteMany({})
        .then(removedPosts => {
            console.log(`Removed ${removedPosts.deletedCount} posts`)
            db.Post.insertMany(db.seedPost)
                .then(addedPosts => {
                    res.json(addedPosts)
                })
        })
})

app.get('/about', function (req, res) {
    res.render('about')
});

// This tells our app to look at the `controllers/posts.js` file 
// to handle all routes that begin with `localhost:3000/posts`
app.use('/posts', postCtrl)

// This tells our app to look at the `controllers/comments.js` file 
// to handle all routes that begin with `localhost:3000/comments`
app.use('/comments', commentCtrl)

//Runs for any route not of the above
app.get('*', function (req, res) {
    res.render('404')
});

/* Tell the app to listen on the specified port
--------------------------------------------------------------- */
app.listen(process.env.PORT, function () {
    console.log('Express is listening to port', process.env.PORT);
});
