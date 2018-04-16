var bodyparser = require('body-parser');
var express = require('express');
var category = require('./category');
var user = require('./user');
var reminder = require('./reminder');
var collection = require('./collection');
var passport = require('passport');

module.exports = function(app) {
  var api = express.Router();

  api.use(bodyparser.json());

  api.post('/authenticate', passport.authenticate('local'), user.myUser);

  api.post('/register', user.registerUser);

  api.get('/me', user.myUser);

  api.post('/me', user.updateMyUser);


  api.post('/category', category.newCategory);

  api.delete('/category/:categoryId', category.deleteCategory);

  api.get('/categories/:onlyactive?', category.getAllCategories);
  

  api.post('/reminder', reminder.addNewReminder);

  api.delete('/reminder/:reminderId', reminder.deleteReminder);

  api.get('/reminders/category/:categoryId', reminder.getRemindersByCategory);


  api.get('/collection/:year/:month', collection.getCollectionInvoice);

  api.post('/invoice', collection.addNewInvoice);

  return api;
};
