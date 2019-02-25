const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Reminders = new mongoose.Schema({
    title: { type: String, required: true },
    lastDayToPay: { type: String, required: true },
    aproxAmount: { type: String },
    note: { type: String },
    status: { type: String },
    beginMonth: { type: Number },
    beginYear: { type: Number },
    category: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});


module.exports = mongoose.model('Reminders', Reminders);