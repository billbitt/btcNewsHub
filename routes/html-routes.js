module.exports = function(app) {

    // home route 
    app.get("/", function(req, res) {

        res.render('home', {news: req.newsDocs});
    });

    // specific article route

}

