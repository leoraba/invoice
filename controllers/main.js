var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json());

  api.get('/h1', 
    require('connect-ensure-login').ensureLoggedIn('/login'), 
    function(req, res){
      res.send('esto es la api');
    }
  );

  return api;
};
