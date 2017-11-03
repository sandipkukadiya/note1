var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('resources');
});
router.get('/register', function (req, res, next) {
    res.render('admin/register', {
        title: 'Register'
    });
});
router.get('/login', function (req, res, next) {
    console.log(req.session.email);
    if (req.session.email == undefined) {
        res.render('admin/login', {
            title: 'Login'
        });
    } else {
        res.redirect('/');
    }

});
router.post('/register', function (req, res, next) {
   
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

    req.checkBody('first_name', 'First Name Field is required').notEmpty();
    req.checkBody('last_name', 'Last Name Field is required').notEmpty();
    req.checkBody('email', 'Email Field is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('password', 'Password Field is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/register', {
            errors: errors,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        });
    } else {
        var newUser = new User({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        });
        User.createUser(newUser, function (err, user) {
            if (err)
                throw err;
            console.log(user);
        });

        req.flash('sucess', 'Registration Successfull');
        res.location('/');
        res.redirect('/');
    }
});

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
function (username, password, done) {
    User.getUserByEmail(username, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            console.log('Username is not valid');
            return done(null, false, {message: 'Unknown User'});
        }
        if (user.password != password) {
            console.log('Invalid Password');
            return done(null, false, {message: 'Unknown User'});
        }
        return done(null, user);
    });
}
));

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), function (req, res) {
    console.log('Authentication Successful');
    req.session.email = req.body.email;
    req.flash('success', 'You are logged in');
    res.redirect('/');
});
router.get('/logout', function (req, res) {
    req.session.email = undefined;
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/users/login');
});
module.exports = router;
