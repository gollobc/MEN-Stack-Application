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


// Configure the app to refresh the browser when nodemon restarts
/*--------------------------------------------------------------- */
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});


// Configure the app (app.set)
/*--------------------------------------------------------------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware (app.use)
/*--------------------------------------------------------------- */
app.use(express.static('public'))
app.use(connectLiveReload());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));



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
    res.send('404 Error: Page Not Found')
});

/* Tell the app to listen on the specified port
--------------------------------------------------------------- */
app.listen(process.env.PORT, function () {
    console.log('Express is listening to port', process.env.PORT);
});
