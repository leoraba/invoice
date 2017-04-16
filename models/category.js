var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Category = new mongoose.Schema({
    name: { type: String, required: true },
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Category', Category);