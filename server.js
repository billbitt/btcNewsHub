// load server dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require('express-handlebars');

// mongoose's promise is deprecated so load promise package
var Promise = require("bluebird");
mongoose.Promise = Promise;

//-- initialize express
var app = express();
// initialize morgan logger
app.use(logger("dev"));  
// initialise  body parser
app.use(bodyParser.urlencoded({  
    extended: false
}));
// initialise json in body parser 
app.use(bodyParser.json());  
// make public a static directory
app.use(express.static("public"));

//--- configure server to use handlebars
app.engine("handlebars", exphbs({defaultLayout: 'main'}));
app.set("view engine", "handlebars");


//--- configure database
// connect to mongodb
mongoose.connect(process.env.MONGODB_URI);
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