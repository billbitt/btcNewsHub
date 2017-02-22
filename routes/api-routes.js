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

    // add Comment
    app.post("/api/article/:id", function(req, res) {
        // create a new comment from the model 
        var newComment = new Comment(req.body);
        // use a custom method to update the date 
        newComment.lastUpdatedDate();  //note: not working yet
        // save the comment in the db
        newComment.save(function(err, doc){
            if (err) {
                res.send(err);
            } else {
                //update the article document by adding the comment id to it 
                Article.findOneAndUpdate(
                    {"_id": req.params.id},
                    {$push: {"comments": doc._id}},
                    {new: true},
                    function(error, document){
                        if (error) {
                            res.send(error);
                        } else {
                            console.log("comment saved");
                            res.send(document);
                        };
                    }
                );
            };
        })
    });

}

