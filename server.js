// load server dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require('express-handlebars');

// load models
var Article = require("./models/Article.js");
var Comment = require("./models/Comment.js");

// load scraping tools
var request = require("request");
var cheerio = require("cherio");

// mongoose's promise is deprecated so load promise package
var Promise = require("bluebird");
mongoose.Promise = Promise;

// initialize express
var app = express();

app.use(logger("dev"));  // initialize morgan logger

app.use(bodyParser.urlencoded({  // initialise  body parser
    extended: false
}));

app.use(bodyParser.json());  // initialise json in body parser 

app.use(express.static("public"));  // // make public a static directory

// configure server to use handlebars
app.engine("handlebards", exphbs({defaultLayout: 'main'}));
app.set("view engine", "handlebards");


//--- configure database
// connect to mongodb
mongoose.connect("mongodb://heroku_x9jkg16f:qkq7k65g7r9sdmj070dudp7t3k@ds157529.mlab.com:57529/heroku_x9jkg16f") 
// store the connection
var db = mongoose.connection;  
// log any errors 
db.on("error", function(err){  
    console.log("Mongoose Error:", err);
});
// log success 
db.once("open", function() {  
    console.log("Mongoose connection successful.");
});

//--- routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);


//--- Listen on port 
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("App listening on port", PORT);
});