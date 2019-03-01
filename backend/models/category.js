const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Category = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String },
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Category', Category);