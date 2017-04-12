var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Reminders = new mongoose.Schema({
    title: { type: String, required: true },
    kind: { type: String },
    lastDayToPay: { type: String, required: true },
    aproxAmount: { type: String },
    note: { type: String },
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}]
});


module.exports = mongoose.model('Reminders', Reminders);