var mongoose = require('mongoose');
var User = require("../models/user");
var bcrypt = require('bcrypt');

//Authenticate user
exports.authenticateUser = function(req, res) {  
    // POST /authenticate

    User.findOne({ username: req.body.username }, function(error, user) {
        if (error) {
            console.log(error);
            res.json({success: false, message: "Error: contacte al administrador del sistema"});
        }
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) {
                console.log(error);
                res.json({success: false, message: "Error: contacte al administrador del sistema"});
            }
            if(result){
                res.json({success: true, user: { username: user.username, name: user.name }});
            }else{
                res.json({success: false, message: "Usuario y/o contraseña son incorrectos"});
            }
        });
    });
};

exports.registerUser = function(req, res){
    // POST /register

    var user = new User({
        username: req.body.email,
        password: req.body.password,
        name: req.body.name
    });
    user.save(function(error) {
        if (error) {
            console.log(error);
            res.json({success: false});
        }
    });
    res.json({success: true});
};