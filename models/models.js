var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost:27017/invoice');

  wagner.factory('db', function() {
    return mongoose;
  });

  var Invoice =
    mongoose.model('Invoice', require('./invoice'), 'invoices');

  var models = {
    Invoice: Invoice,
  };

  // To ensure DRY-ness, register factories in a loop
  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });

  return models;
};