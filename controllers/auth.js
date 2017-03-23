function setupAuth(User, app) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    // High level serialize/de-serialize configuration for passport
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id : id }).exec(done);
    });

    // Configure the local strategy for use by Passport.
    passport.use(new LocalStrategy(function(username, password, done) {
        process.nextTick(function() {
            User.findOne({
                'username': username, 
            }, function(err, user) {
                if (err) {
                return done(err);
                }

                if (!user) {
                return done(null, false);
                }

                if (user.password != password) {
                return done(null, false);
                }

                return done(null, user);
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