var mongoose = require('mongoose');
var Reminder = require("../models/reminder");

exports.addNewReminder = function(req, res) {  
    // POST /reminder

    var reminder = new Reminder({
        title: req.body.title,
        kind: req.body.kind,
        lastDayToPay: req.body.lastDay,
        aproxAmount: req.body.aproxAmount,
        note: req.body.note,
        category: req.body.categoryId
    });
    reminder.save(function(error){
        if(error){
            console.log(error);
            res.json({success: false});
        }else{
            res.json({success: true});
        }
    });
}

exports.getRemindersByCategory = function(req, res){
    // GET /reminders/category/:categoryId

     Reminder.find({ "category": req.params.categoryId}).exec(function(error, reminders) {
        if (error) {
        return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        res.json({ reminders: reminders });
    });
}

exports.deleteReminder = function(req, res){
    // DELETE /reminder/:reminderId

    Reminder.remove({ "_id": req.params.reminderId}, function(error){
        if(error){
            console.log(error);
            res.json({success: false});
        }else{
            res.json({success: true});
        }
    });
}