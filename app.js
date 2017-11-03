// Required files
var express = require('express'); // root express
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'); // use for token of OAuth2 
var expressValidator = require('express-validator'); // validation with expression
var session = require('express-session'); // for session
var cookieParser = require('cookie-parser');// for coockies
var bodyParser = require('body-parser');
var passport = require('passport'); // authentication middleware ex. OAth2
var LocalStrategy = require('passport-local').Strategy; // local auth
var flash = require('connect-flash'); //Flash messages are stored in the session
var uuid = require("node-uuid"); // cryptographically-strong random number APIs  ex. '6c84fb90-12c4-11e1-840d-7b25c5ee775a' 
var _ = require('underscore-node'); // use  for cross-browsing compatiblity

/*routes file*/
// admin router where it is
var routes = require('./routes/admin/index');
var users = require('./routes/admin/users');
var posts = require('./routes/admin/posts');
var media_library = require('./routes/admin/media-library');
var api = require('./routes/api');
// fronted router where it is
var index = require('./routes/frontend/index');
var flash = require('connect-flash');
var mongo = require('mongodb'); // MongoDB
var mongoose = require('mongoose'); // mongoose driver for MongoDB
var db = mongoose.connection; // connection
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // tell express to where is view files

app.set('view engine', 'jade'); // tell express that what type of files
app.set('view options', {
    layout: false
});

/***********Below we write middlewere **********/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); // specify the format just specify it like this in logger()
app.use(bodyParser.json()); //which is use for what kind of json file use here is defult set 
app.use(expressValidator()); // 
app.use(bodyParser.urlencoded({extended: false})); 
//app.use(require('express-method-override'));
// below we are definded with express and tell what kind of status init
app.use(session({  
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use('/theme', express.static(__dirname + '/views/theme/'));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
// here route file defind init
app.use('/admin', routes);
app.use('/admin', users);
app.use('/admin', posts);
app.use('/admin', media_library);
app.use('/', index);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
