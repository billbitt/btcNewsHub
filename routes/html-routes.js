// load models
var Article = require("../models/Article.js");
var Comment = require("../models/Comment.js");

// export routes
module.exports = function(app) {

    // home route for all news 
    app.get("/", function(req, res) {
        //grabs all of the articles and render them in handlebars
        Article.find({})
        .populate("comments")
        .exec(function(err, docs){
            if (err) {
                res.send(err);
            } else {
                res.render('home', {news: docs});
            };
        });
        
    });

    // route for one specific article 
    app.get("/article/:articleId", function(req, res) {
        Article.findById(req.params.articleId)
        .populate("comments")
        .exec(function(err, doc){
            if (err) {
                res.send(err);
            } else {
                res.render("article", {article: doc});
            };
        });
    });

    // route for new comment to an article 
    app.post("/article/:articleId", function(req, res) {
        // create a new comment from the model 
        var newComment = new Comment(req.body);
        // save the comment in the db
        newComment.save(function(err, doc){
            if (err) {
                res.send(err);
            } else {
                //update the article document by adding the comment id to it 
                Article.findOneAndUpdate(
                    {"_id": req.params.articleId},
                    {$push: {"comments": doc._id}},
                    {new: true},
                    function(error, document){
                        if (error) {
                            res.send(error);
                        } else {
                            //re-render the article page
                            var redirectUrl = "/article/" + req.params.articleId;
                            res.redirect(redirectUrl);
                        };
                    }
                );
            };
        })
    });

    // route to compose a reply 
    app.get("/comment/:commentId", function(req,res) {
        Comment.findById(req.params.commentId)
        .populate("replies")
        .exec(function(err, doc){
            if (err) {
                res.send(err);
            } else {
                res.render("comment", {comment: doc})
            }
        })
    });

    // route to submit a reply  
    app.post("/comment/:commentId", function(req,res) {
        // create a new comment from the model 
        var newComment = new Comment(req.body);
        // save the comment in the db
        newComment.save(function(err, doc){
            if (err) {
                res.send(err);
            } else {
                //update the comment document by adding the reply id to it 
                Comment.findOneAndUpdate(
                    {"_id": req.params.commentId},
                    {$push: {"replies": doc._id}},
                    {new: true},
                    function(error, document){
                        if (error) {
                            res.send(error);
                        } else {
                            //re-render the reply page
                            res.redirect("/comment/" + req.params.commentId);
                        };
                    }
                );
            };
        })
    });

    // route to delete comment 
    app.get("/delete/:articleId/:commentId", function(req, res) {
        Comment.findByIdAndRemove(req.params.commentId, function(err, doc) {
            if (err) {
                res.send(err);
            } else {
                console.log("successfull")
                //re-render page
                res.redirect("/article/" + req.params.articleId);
            };
        });
    });

}

