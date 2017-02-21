// load models
var Article = require("../models/Article.js");
var Comment = require("../models/Comment.js");

// load scraping tools
var request = require("request");
var cheerio = require("cheerio");

//export the routes 
module.exports = function(app) {

    // scrape 
    app.get("/api/scrape", function(req, res) {
        // scrape the merkle  
        request("https://themerkle.com/category/news/crypto/", function(error, response, html ) {
            if (error) {
                console.log("error:", error);
            };
            var $ = cheerio.load(html);  //load the html into cheerio and save as $ as shorthand selector
            $("article.latestPost.excerpt").each(function(i, element) {
                console.log("found an article");
                // create empty object to store results in 
                var result = {}; 
                // save the title, lead, and link of each article
                result.title = $(element).children("h2", "header").text();
                result.link = $(element).children("a", "header").attr("href");
                result.body = $(element).children("div.front-view-content").text();
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
        });
        //send response when scrape is complete
        res.send("scrape complete");
    });

    // return all articles
    app.get("/api/articles", function(req, res) {
        //grabs all of the articles and return them 
        Article.find({}, function(err, docs){
            if (err) {
                res.send(err);
            } else {
                res.send(docs);
            };
        });
    });

    // add Comment
    // return all articles
    app.post("/api/comment/:id", function(req, res) {
        
        //grabs all of the articles and return them 
        Article.find({}, function(err, docs){
            if (err) {
                res.send(err);
            } else {
                res.send(docs);
            };
        });
    });

}

