const mongoose = require('mongoose');
const Reminder = require("../models/reminder");
const Invoice = require("../models/invoice");

exports.addNewReminder = function(req, res) {  
    // POST /api/reminder

    if(req.user){
        let reminder = new Reminder({
            title: req.body.title,
            lastDayToPay: req.body.lastDay,
            aproxAmount: req.body.aproxAmount,
            note: req.body.note,
            beginMonth: req.body.beginMonth,
            beginYear: req.body.beginYear,
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

exports.editReminder = function(req, res) {  
    // PUT /api/reminder

    if(req.user){
        Reminder.findOne({ "_id": req.body.reminderId }).exec(function(error, reminder){
            if (error) {
                res.json({ success: true, message: error.toString() });
            } else if (!reminder) {
                res.json({ success: true, message: "Invalid request" });
            } else {
                reminder.title = req.body.title;
                reminder.lastDayToPay = req.body.lastDay;
                reminder.aproxAmount = req.body.aproxAmount;
                reminder.note = req.body.note;
                reminder.beginMonth = req.body.beginMonth,
                reminder.beginYear = req.body.beginYear;
                reminder.save(function(error){
                    if(error){
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

exports.getRemindersByCategory = function(req, res){
    // GET /api/reminders/category/:categoryId

     if(req.user){
        Reminder.find({ "category": req.params.categoryId, "status": { $ne: "inactive" }}).exec(function(error, reminders) {
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
        Reminder.findOne({ "_id": req.params.reminderId }).exec(function(error, reminder){
            if (error) {
                res.json({ success: true, message: error.toString() });
            } else if (!reminder) {
                res.json({ success: true, message: "Invalid request" });
            } else {
                reminder.status = "inactive";
                reminder.save(function(error){
                    if(error){
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