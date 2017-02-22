// load models
var Article = require("../models/Article.js");
var Comment = require("../models/Comment.js");

// load scraping tools
var request = require("request");
var cheerio = require("cheerio");

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

    // route to referesh scrape
    app.get("/refresh", function(req, res) {
        // make a request to scrape for new articles 
        request("https://themerkle.com/category/news/crypto/", function(error, response, body ) {
            // check for errors 
            if (error) {
                console.log("error:", error);
            };
            // parse the body 
            var $ = cheerio.load(body);  //load the html into cheerio and save as $ as shorthand selector
            $("article.latestPost.excerpt").each(function(i, element) {
                console.log("found an article");
                // create empty object to store results in 
                var result = {}; 
                // save the title, lead, and link of each article
                result.title = $(element).children("header").children("h2").text();
                result.link = $(element).children("a", "header").attr("href");
                result.body = $(element).children("div.front-view-content").text();
                
                //break link down to source
                var sourceUrl = [];
                var start = false;
                for (var i = 0; i < result.link.length; i++){
                    if (start === false) {  // start after "//"
                        if ((result.link[i] === "/") && (result.link[i-1] === "/")) start = true;
                    } else {
                        if (result.link[i] != "/"){ // push each letter if we haven't reached "/"
                            sourceUrl.push(result.link[i]);  
                        } else {  // if we have reached "/" break out 
                            break;
                        };
                    };
                };
                result.source = sourceUrl.join(""); 
                // create an entry using the Article model
                var entry = new Article(result);
                // save the entry to the db
                entry.save(function(err, doc) {
                    // log any errors
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Document added to Articles collection.");
                    };
                });
            });
            // redirect back to home page
            res.redirect("/");
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

