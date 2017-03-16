var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var User = new mongoose.Schema({
    username: { type: String, required: true, lowercase: true, index: { unique: true } },
    password: { type: String, required: true },
    name: { type: String, required: true }
});


// Define pre-save hook
User.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.hash(user.password, 12, function (err, hash) {
        if(err) {
            next(err);
            return;
        }
        user.password = hash;
        next();
    });
});

module.exports = User;