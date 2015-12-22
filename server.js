// BASE SETUP
// =============================================================================

// call the packages we need
var mongoose = require('mongoose');
var express    = require('express');        // call express
var app        = express();                // define our app using express
var router = express.Router();              // get an instance of the express Router
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;        // set our port

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/');

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: 'ilovescotchscotchyscotchscotch',
  cookie: { expires : new Date(Date.now() + 3600000) }
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// TO DO: router component
require('./app/routes.js')(app, passport, express, router); // load our routes and pass in our app and fully configured passport

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);