var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Invoice = new mongoose.Schema({
    title: { type: String },
    year: { type: String },
    month: { type: String },
    datePaid: { type: String },
    status: { type: String },
    kind: { type: String},
    amount: { type: String },
    note: { type: String },
    reminder: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reminder'}],
    category: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});


module.exports = mongoose.model('Invoice', Invoice);