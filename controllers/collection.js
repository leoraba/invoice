var mongoose = require('mongoose');
var Category = require("../models/category");
var Reminder = require("../models/reminder");
var Invoice = require("../models/invoice");
var _ = require("underscore");


exports.getCollectionInvoice = function(req, res) {
    // GET /api/collection/:year/:month

    Invoice.find({ "year": req.params.year, "month": req.params.month }, function(err, inv){
        let arrayReminder = [];
        inv.forEach(function(value, key){
            arrayReminder.push(value.reminder);
        });
        $find = "";
        if(arrayReminder.length > 0){
            $find = { "_id": { $nin: arrayReminder} };
        }
        Reminder.find( $find, function(err, rem){
            res.json({ "invoices": inv, "reminders": rem });
        });
    });
}

exports.addNewInvoice = function(req, res){
    //POST /invoice

    Reminder.findOne({ "_id": req.body.reminderId }, function(err, rem){
        var lastDate = new Date(req.body.year, req.body.month - 1, rem.lastDayToPay);
        var paidDate = new Date(req.body.datePaid + " GMT-0600");
        var status = "Paid on time"
        if(paidDate > lastDate){
            status = "late";
        }
        
        var invoice = new Invoice({
            title: rem.title,
            year: req.body.year,
            month: req.body.month,
            datePaid: req.body.datePaid,
            status: status,
            kind: rem.kind,
            amount: req.body.amount,
            note: req.body.note,
            reminder: req.body.reminderId,
            category: req.body.categoryId
        });

        invoice.save(function(error){
            if(error){
                console.log(error);
                res.json({success: false});
            }else{
                res.json({success: true});
            }
        });
    });
}