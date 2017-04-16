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
        Reminder.remove({ "category": req.params.categoryId}, function(error){
            if(error){
                console.log(error);
                res.json({success: true, message: 'Error to delete category'});
            }else{
                Category.remove({ "_id": req.params.categoryId}, function(error){
                    if(error){
                        console.log(error);
                        res.json({success: true, message: 'Error to delete category'});
                    }else{
                        Invoice.remove({ "category": req.params.categoryId }, function(error){
                            if(error){
                                console.log(error);
                                res.json({success: true, message: 'Error to delete category'});
                            }else{
                                res.json({success: true});
                            }
                        });
                    }
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
        Category.find({ user: req.user._id}).exec(function(error, categories) {
            if (error) {
                res.json({ success: true, error: error.toString() });
            }
            res.json({ success: true, categories: categories });
        });
    }else{
        res.json({success: false});
    }
}