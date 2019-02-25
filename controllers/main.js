const bodyparser = require('body-parser');
const express = require('express');
const category = require('./category');
const user = require('./user');
const reminder = require('./reminder');
const collection = require('./collection');
const passport = require('passport');
const helmet = require('helmet');

module.exports = function(app) {
  let api = express.Router();

  api.use(bodyparser.json());

  api.use(helmet());

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
