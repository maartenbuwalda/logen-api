// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var mongoose = require('mongoose');
var express    = require('express');        // call express
var app        = express();                // define our app using express

var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;        // set our port

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/');

var Task = require('./app/models/task')

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
// can be used for checking authentication?
router.use(function(req, res, next){
	console.log('Something something');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.get('/', function(req, res) {
    res.render('index.ejs'); // load the index.ejs file
});

app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') }); 
});

// process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// show the signup form
app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user : req.user // get the user out of session and pass to template
    });
});

// =====================================
// LOGOUT ==============================
// =====================================
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


// more routes for our API will happen here

router.route('/tasks')

    // create a task (accessed at POST http://localhost:8080/api/tasks)
    .post(function(req, res) {
        
        var task = new Task();      // create a new instance of the Task model
        task.name = req.body.name;  // set the tasks name (comes from the request)
        task.description = req.body.description;
        task.category = req.body.category;
        task.importance = req.body.importance;
        task.time_created = req.body.time_created;
        task.time_finished = req.body.time_finished;
        task.rating = req.body.rating;

        // save the task and check for errors
        task.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Task created!' });
        });
        
    })

     // get all the tasks (accessed at GET http://localhost:8080/api/tasks)
    .get(function(req, res) {
        Task.find(function(err, tasks) {
            if (err)
                res.send(err);

            res.json(tasks);
        });
    });

router.route('/tasks/:task_id')

    // get the task with that id (accessed at GET http://localhost:8080/api/tasks/:task_id)
    .get(function(req, res) {
        Task.findById(req.params.task_id, function(err, task) {
            if (err)
                res.send(err);
            res.json(task);
        });
    })

    .put(function(req, res) {

        // use our task model to find the task we want
        Task.findById(req.params.task_id, function(err, task) {

            if (err)
                res.send(err);

            task.name = req.body.name;
	        task.description = req.body.description;
	        task.category = req.body.category;
	        task.importance = req.body.importance;
	        task.time_created = req.body.time_created;
	        task.time_finished = req.body.time_finished;
	        task.rating = req.body.rating;
	        task.archived = req.body.archived;

            // save the task
            task.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Task updated!' });
            });

        });
    })

    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Task.remove({
            _id: req.params.task_id
        }, function(err, task) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// TO DO: router component
// require('./app/routes.js')(app, passport, express); // load our routes and pass in our app and fully configured passport

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);