module.exports = function(app) {

    // scrape 
    app.get("/api/scrape", function(req, res) {
        // scrape cointelegraph 
        request("https://cointelegraph.com/tags/bitcoin", function(error, response, html ) {
            var $ = cheerio.load(html);  //load the html into cheerio and save as $ as shorthand selector
            $("#recent row result").each(function(i, element) {
                // create empty object to store results in 
                var result = {}; 
                // save the title, lead, and link of each article
                result.title = $(this).children("h2").text();
                result.link = $(this).children("h2").attr("href");
                // create an entry using the Article model
                var entry = new Article(result);
                // save the entry to the db
                entry.save(function(err, doc) {
                    // log any errors
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(doc);
                    };
                });
            });
        });
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

}

