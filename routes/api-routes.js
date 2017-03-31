// load models
var Article = require("../models/Article.js");
var Comment = require("../models/Comment.js");

//export the routes 
module.exports = function(app) {

    // return all articles
    app.get("/api/articles", function(req, res) {
        //grabs all of the articles and return them 
        Article.find({})
        .populate("comments")
        .exec(function(err, docs){
            if (err) {
                res.send(err);
            } else {
                res.send(docs);
            };
        });
    });

    // return one article
    app.get("/api/article/:id", function(req, res) {
        //grabs all of the articles and return them 
        Article.findById(req.params.id)
        .populate("comments")
        .exec(function(err, docs){
            if (err) {
                res.send(err);
            } else {
                res.send(docs);
            };
        });
    });

    // route to delete a comment 
    app.delete("/api/comment/:id", function(req, res) {
        Comment.findOneAndUpdate(
            {
                "_id": req.params.id
            },
            {
                $set: {"body": "deleted"}
            }, 
            function(err, doc) {
                if (err) {
                    res.send(err);
                } else {
                    console.log("update successfull", doc)
                    //re-render page
                    res.send("delete complete");
                };
            }
        );
    });

}

