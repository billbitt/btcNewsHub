// load models
var Article = require("../models/Article.js");
var Comment = require("../models/Comment.js");

// load scraping tools
var request = require("request");
var cheerio = require("cheerio");

// load dependencies
var moment = require("moment")
var Promise = require("bluebird");

// export routes
module.exports = function(app) {

    // home route for all news 
    app.get("/", function(req, res) {
        //grabs all of the articles and render them in handlebars
        Article.find({})
        .limit(10)
        .sort({ dateCreated: 1 })
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
                console.log("pub:", result.publishDate);
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
            res.redirect("/");  //Note: asnych issue 
        });
    });

    // route to view one specific article 
    app.get("/article/:id", function(req, res) {
        Article.findById(req.params.id)
        .populate({
            path: "comments",
            populate: {
                path: "comments",
                populate: {
                    path: "comments",
                    populate: {
                        path: "comments",
                        populate: {
                            path: "comments"
                        }
                    }
                }
            }
        })
        .exec(function(err, doc){
            // handle errors
            if (err) {
                res.send(err);
            // if no errors, display article 
            } else {
                // NOTE: trying to change the date property in the doc using moment before it is displayed 
                console.log("doc1:", doc);
                for (var i = 0; i < doc.comments.length; i++){
                    console.log("date->", doc.comments[i].dateCreated);
                    doc.comments[i].dateCreated = "foo";
                    console.log("date->", doc.comments[i].dateCreated);
                    //doc.comments[i].dateCreated = moment(doc.comments[i].dateCreated).fromNow(true);
                }
                console.log("doc2:", doc);
                // render the article 
                res.render("article", {article: doc});
            };
        });
    });

    // route to view a comment and replies  
    app.get("/comment/:id", function(req,res) {
        Comment.findById(req.params.id)
        .populate({
            path: "comments",
            populate: {
                path: "comments",
                populate: {
                    path: "comments",
                    populate: {
                        path: "comments",
                        populate: {
                            path: "comments"
                        }
                    }
                }
            }
        })
        .exec(function(err, doc){
            if (err) {
                res.send(err);
            } else {
                res.render("comment", {comment: doc})
            }
        })
    });

    // route to add a new comment to an article 
    app.post("/article/:id", function(req, res) {
        // create a new comment from the model 
        var newComment = new Comment(req.body);
        // update the "dateUpdated" date
        //newComment.updateDateUpdated();
        // save the comment in the db
        newComment.save(function(err, doc){
            if (err) {
                res.send(err);
            } else {
                //update the article document by adding the comment id to it 
                Article.findOneAndUpdate(
                    {"_id": req.params.id},
                    {$push: {"comments": doc._id}},
                    {
                        new: true
                    },
                    function(error, document){
                        if (error) {
                            res.send(error);
                        } else {
                            //re-render the article page
                            var redirectUrl = "/article/" + req.params.id;
                            res.redirect(redirectUrl);
                        };
                    }
                );
            };
        })
    });

    // route to add a new comment to a comment  
    app.post("/comment/:id", function(req,res) {
        // create a new comment from the model 
        var newComment = new Comment(req.body);
        // update the "dateUpdated" date
        //newComment.updateDateUpdated();
        // save the comment in the db
        newComment.save(function(err, doc){
            if (err) {
                res.send(err);
            } else {
                //update the comment document by adding the reply id to it 
                Comment.findOneAndUpdate(
                    {"_id": req.params.id},
                    {$push: {"comments": doc._id}},
                    {new: true},
                    function(error, document){
                        if (error) {
                            res.send(error);
                        } else {
                            //re-render the reply page
                            res.redirect("/comment/" + req.params.id);
                        };
                    }
                );
            };
        })
    });

}

