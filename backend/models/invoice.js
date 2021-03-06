const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Invoice = new mongoose.Schema({
    title: { type: String },
    year: { type: String },
    month: { type: String },
    datePaid: { type: String },
    status: { type: String },
    amount: { type: String },
    note: { type: String },
    reminder: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reminder'}],
    category: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});


module.exports = mongoose.model('Invoice', Invoice);