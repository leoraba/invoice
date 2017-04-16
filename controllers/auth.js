var User = require("../models/user");

function setupAuth(app) {
    var passport = require('passport');
    var Strategy = require('passport-local').Strategy;
    var bcrypt = require('bcrypt');

    // High level serialize/de-serialize configuration for passport
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id : id }).exec(done);
    });

    // Configure the local strategy for use by Passport.
    passport.use(new Strategy(function(username, password, done) {
         User.findOne({ username: username }, function(error, user) {
            if (error || !user) {
                return done(error);
            }
            bcrypt.compare(password, user.password, function(err, result) {
                if (err) {
                    return done(err);
                }
                if(result){
                    return done(null, user);
                }else{
                    return done(null, false);
                }
            });
        });
    }));
    
    // Express middlewares
    app.use(require('express-session')({ 
        secret: 'keyboard cat',
        resave: false, 
        saveUninitialized: false 
    }));
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = setupAuth;