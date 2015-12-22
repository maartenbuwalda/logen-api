module.exports = function(app, passport, express, router) {

    var User = require('./models/user')
    var Task = require('./models/task')

    // middleware to use for all requests
    // can be used for checking authentication?
    app.use(function(req, res, next){
      // console.log('Something');
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
        successRedirect : '/overview', // redirect to the overview page
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
        successRedirect : '/overview', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/overview', isLoggedIn, function(req, res) {
        res.locals = {
            user: req.user
        }
        res.render('overview.ejs');
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/overview',
            failureRedirect : '/'
        }));


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // more routes for our API will happen here

    app.route('/tasks')

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

    app.route('/tasks/:task_id')

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

        // delete the task with this id (accessed at DELETE http://localhost:8080/api/tasks/:task_id)
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
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}