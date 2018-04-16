var mongoose = require('mongoose');
var Category = require("../models/category");
var Reminder = require("../models/reminder");
var Invoice = require("../models/invoice");

//Add a new question
exports.newCategory = function(req, res) {  
    // POST /api/category

    if(req.user){
        var category = new Category({
            name: req.body.categoryName,
            user: req.user._id
        });
        category.save(function(error){
            if(error){
                console.log(error);
                res.json({success: true, message: 'Error to save category'});
            }
        });
        res.json({success: true});
    }else{
        res.json({success: false});
    }
};

exports.deleteCategory = function(req, res){
    // DELETE /api/category/:categoryId

    if(req.user){
        Invoice.findOne({ "category": req.params.categoryId }).exec(function (error, invoices) {
            // Delete Category if there is no invoices for this category
            if(invoices == null){
                Category.remove({ "_id": req.params.categoryId}, function(error){
                    if(error){
                        console.log(error);
                        res.json({success: true, message: 'Error to delete category'});
                    }else{
                        res.json({success: true});
                    }
                });
            }else{
                Category.findOne({ "_id": req.params.categoryId }).exec(function(error, category){
                    category.status = "inactive";
                    category.save(function(error){
                        if(error){
                            res.json({success: true, message: error.toString()});
                        }else{
                            Reminder.update({ "category": req.params.categoryId }, { "status": "inactive" }, { multi: true }, function(err, rows){  
                                if(error){
                                    res.json({success: true, message: error.toString()});
                                }else{
                                    res.json({success: true});
                                }
                            });
                        }
                    });
                });
            }
        });
    }else{
        res.json({success: false});
    }
}

exports.getAllCategories = function(req, res){
    // GET /api/categories

    if(req.user){
        var findQry = { user: req.user._id };
        if(req.params.onlyactive){
            findQry = { user: req.user._id, "status": { $ne: "inactive" } };
        }
        Category.find(findQry).exec(function(error, categories) {
            if (error) {
                res.json({ success: true, error: error.toString() });
            }
            res.json({ success: true, categories: categories });
        });
    }else{
        res.json({success: false});
    }
}