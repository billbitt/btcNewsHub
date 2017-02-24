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
        default: "anonymous"
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    },
    comments: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Comment"
    }],
    totalComments: {
        type: Number,
        required: true,
        default: 0
    },
    score: {
        type: Number,
        default: 0,
        get: v => Math.round(v),
        set: v => Math.round(v)
    },

});

// methods for the schema 
CommentSchema.methods.updateDateUpdated = function(){
    this.dateUpdated = Date.now;
    return this.dateUpdated;
};

// use the schema to make the model
var Comment = mongoose.model("Comment", CommentSchema);

// export the model
module.exports = Comment;