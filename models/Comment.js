var mongoose = require("mongoose");

// create the Schema class 
var Schema = mongoose.Schema;

// create a new schema for Comments 
var CommentSchema = new Schema({
    body: {
        type: String,
        trim: true,
        required: "A comment is required to comment",
        validate: [
            function(input) {
                return input.length >= 2;
            },
            "Comments must be longer than one characater"
        ]
    },
    author: {
        type: String,
        trim: true,
        required: "An author is required to comment",
        validate: [
            function(input) {
                return input.length >= 2;
            },
            "Author names must be longer than one character"
        ]
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    replies: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Comment"
    }]
});

// methods for the schema 
CommentSchema.methods.lastUpdatedDate = function(){
    this.updatedDate = Date.now;
    return this.updatedDate;
};

// use the schema to make the model
var Comment = mongoose.model("Comment", CommentSchema);

// export the model
module.exports = Comment;