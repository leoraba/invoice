var mongoose = require('mongoose');
var Category = require("../models/category");
var Reminder = require("../models/reminder");
var Invoice = require("../models/invoice");
var _ = require("underscore");


exports.getCollectionInvoice = function(req, res) {
    // GET /api/collection/:year/:month
    if(req.user){
        Invoice.find({ year: req.params.year, month: req.params.month, user: req.user._id }, function(err, inv){
            let totalPaid = 0;
            let totalPending = 0;
            let arrayReminder = [];
            let categoryCounter = {};
            inv.forEach(function(value, key){
                if(categoryCounter[value.category]) categoryCounter[value.category] = categoryCounter[value.category] + 1;
                else categoryCounter[value.category] = 1;
                arrayReminder.push(value.reminder);
                totalPaid += parseFloat(value.amount);
            });

            let find = { user: req.user._id, 
                        "status": { $ne: "inactive" }, 
                        $or: [ 
                            { "beginYear": { $eq: req.params.year }, "beginMonth": { $lte: req.params.month } }, 
                            { "beginYear": { $lt: req.params.year  } }
                        ] };
            if(arrayReminder.length > 0){
                find._id = { $nin: arrayReminder}
            }
            Reminder.find( find, function(err, rem){
                rem.forEach(function(value, key){
                    if(categoryCounter[value.category]) categoryCounter[value.category] = categoryCounter[value.category] + 1;
                    else categoryCounter[value.category] = 1;
                    totalPending += parseFloat(value.aproxAmount);
                }); 
                
                res.json({ success: true, invoices: inv, reminders: rem, paid: totalPaid.toFixed(2), pending: totalPending.toFixed(2), categoryCounter: categoryCounter });
            });
        });
    }else{
        res.json({success: false});
    }
}

exports.addNewInvoice = function(req, res){
    //POST /api/invoice

    if(req.user){
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
                amount: req.body.amount,
                note: req.body.note,
                reminder: req.body.reminderId,
                category: req.body.categoryId,
                user: req.user._id
            });

            invoice.save(function(error){
                if(error){
                    console.log(error);
                    res.json({success: true, message: 'Failed to save'});
                }else{
                    res.json({success: true});
                }
            });
        });
    }else{
        res.json({success: false});
    }
}