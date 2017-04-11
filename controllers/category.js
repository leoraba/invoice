var mongoose = require('mongoose');
var Category = require("../models/category");
var Reminder = require("../models/reminder");

//Add a new question
exports.newCategory = function(req, res) {  
    // POST /category

    var category = new Category({
        name: req.body.categoryName
    });
    category.save(function(error){
        if(error){
            console.log(error);
            res.json({success: false});
        }
    });
    res.json({success: true});
};

exports.deleteCategory = function(req, res){
    // DELETE /category/:categoryId

    Reminder.remove({ "category": req.params.categoryId}, function(error){
        if(error){
            console.log(error);
            res.json({success: false});
        }else{
            Category.remove({ "_id": req.params.categoryId}, function(error){
                if(error){
                    console.log(error);
                    res.json({success: false});
                }else{
                    res.json({success: true});
                }
            });
        }
    });
}

exports.getAllCategories = function(req, res){
    // GET /categories
    Category.find().exec(function(error, categories) {
        if (error) {
        return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        res.json({ categories: categories });
    });
}