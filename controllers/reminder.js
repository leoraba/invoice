var mongoose = require('mongoose');
var Reminder = require("../models/reminder");
var Invoice = require("../models/invoice");

exports.addNewReminder = function(req, res) {  
    // POST /api/reminder

    if(req.user){
        var reminder = new Reminder({
            title: req.body.title,
            kind: req.body.kind,
            lastDayToPay: req.body.lastDay,
            aproxAmount: req.body.aproxAmount,
            note: req.body.note,
            category: req.body.categoryId,
            user: req.user._id
        });
        reminder.save(function(error){
            if(error){
                res.json({success: true, message: error.toString()});
            }else{
                res.json({success: true});
            }
        });
    }else{
        res.json({success: false});
    }
}

exports.getRemindersByCategory = function(req, res){
    // GET /api/reminders/category/:categoryId

     if(req.user){
        Reminder.find({ "category": req.params.categoryId}).exec(function(error, reminders) {
            if (error) {
                res.json({ success: true, message: error.toString() });
            }
            res.json({ success: true, reminders: reminders });
        });
    }else{
        res.json({success: false});
    }
}

exports.deleteReminder = function(req, res){
    // DELETE /api/reminder/:reminderId

    if(req.user){
        Reminder.remove({ "_id": req.params.reminderId}, function(error){
            if(error){
                console.log(error);
                res.json({success: true, message: error.toString()});
            }else{
                Invoice.remove({ "reminder": req.params.reminderId }, function(error){
                    if(error){
                        console.log(error);
                        res.json({success: true, message: error.toString()});
                    }else{
                        res.json({success: true});
                    }
                });
            }
        });
    }else{
        res.json({success: false});
    }
}