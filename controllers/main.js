var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status')
var category = require('./category');
var user = require('./user');
var reminder = require('./reminder');
var collection = require('./collection');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json());

  api.get('/h1', 
    require('connect-ensure-login').ensureLoggedIn('/login'), 
    function(req, res){
      res.json({msg: "Esto es una api segura"});
    }
  );

  api.post('/authenticate', user.authenticateUser);

  api.post('/register', user.registerUser);

  api.post('/category', category.newCategory);

  api.delete('/category/:categoryId', category.deleteCategory);

  api.get('/categories', category.getAllCategories);
  

  api.post('/reminder', reminder.addNewReminder);

  api.delete('/reminder/:reminderId', reminder.deleteReminder);

  api.get('/reminders/category/:categoryId', reminder.getRemindersByCategory);


  api.get('/collection/:year/:month', collection.getCollectionInvoice);

  api.post('/invoice', collection.addNewInvoice);

  return api;
};
