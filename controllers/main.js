var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json());

  api.get('/h1', 
    require('connect-ensure-login').ensureLoggedIn('/login'), 
    function(req, res){
      res.json({msg: "Esto es una api segura"});
    }
  );

  api.post('/authenticate', function(req, res){
    res.json({success: true});
  });

  return api;
};
