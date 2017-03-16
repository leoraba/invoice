var mongoose = require('mongoose');

var Invoice = new mongoose.Schema({
    category: { type: String, required: true },
    subcategory: { type: String },
    company: { type: String },
    lastDayToPay: { type: String },
    lastMonthPaid: { type: String }
});


module.exports = Invoice;