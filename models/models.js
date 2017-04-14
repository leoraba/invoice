var mongoose = require('mongoose');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost:27017/invoice');

  wagner.factory('db', function() {
    return mongoose;
  });
};