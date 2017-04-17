var mongoose = require('mongoose');
var User = require("../models/user");
var bcrypt = require('bcrypt');

//Authenticate user
exports.myUser = function(req, res) {
    if(req.user){
        res.json({success: true, user: { username: req.user.username, name: req.user.name }});
    }else{
        res.json({success: false});
    }
}

exports.updateMyUser = function(req, res){
    // POST /api/me

    if(req.user){
        User.findOne({ _id: req.user._id }, function(error, user) {
            user.name = req.body.name;
            if(req.body.password){
                user.password = req.body.password;
            }
            user.save(function(error) {
                if (error) {
                    console.log(error);
                    res.json({success: true, message: error.toString()});
                }
            });
            res.json({success: true});
        })
    }else{
        res.json({success: false});
    }
}

exports.registerUser = function(req, res){
    // POST /api/register

    var user = new User({
        username: req.body.email,
        password: req.body.password,
        name: req.body.name
    });
    user.save(function(error) {
        if (error) {
            console.log(error);
            res.json({success: true, message: error.toString()});
        }
    });
    res.json({success: true});
};