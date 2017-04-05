var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var bcrypt = require('bcrypt');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json());

  api.get('/h1', 
    require('connect-ensure-login').ensureLoggedIn('/login'), 
    function(req, res){
      res.json({msg: "Esto es una api segura"});
    }
  );

  api.post('/authenticate', wagner.invoke(function(User) {
    return function(req, res){
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
    }
  }));

  api.post('/register',  wagner.invoke(function(User) {
    return function(req, res){
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
    }
  }));

  return api;
};
