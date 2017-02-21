// load models
var Article = require("../models/Article.js");
var Comment = require("../models/Comment.js");

// export routes
module.exports = function(app) {

    // home route 
    app.get("/", function(req, res) {
        //grabs all of the articles and render them in handlebars
        Article.find({}, function(err, docs){
            if (err) {
                res.send(err);
            } else {
                res.render('home', {news: docs});
            };
        });
        
    });

}

