// load models
var Article = require("../models/Article.js");
var Comment = require("../models/Comment.js");

// export routes
module.exports = function(app) {

    // home route 
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

    // new comment route
    app.post("/comment/:id", function(req, res) {
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
                            //re-render page
                            res.redirect("/");
                        };
                    }
                );
            };
        })
    });

    // new comment route
    app.delete("/comment/:id", function(req, res) {
        // create a new comment from the model 
        Comment.findOneAndRemove(
            {"_id": req.params.id}, 
            function(err, doc) {
                if (err) {
                    console.log("errrored");
                    res.send(err);
                } else {
                    console.log("successfull")
                    //re-render page
                    res.redirect("/");
                };
            }
        );
    });

}

