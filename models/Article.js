var mongoose = require("mongoose");

// create a schema class
var Schema = mongoose.Schema;

// create a new schema
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
    },
    link: {
        type: String,
        required: true,
        index: true,
        unique: "That article already exists in our database"
    },
    source: {
        type: String,
        required: true,
    },
    publishDate: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    comments: [{ // will contain an array of comments 
        type: Schema.Types.ObjectId, // will save the object Id of a comment 
        ref: "Comment" // directs that the object Ids stored here are related to the Comment model
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
    }
});

// custom methods for this schema 
ArticleSchema.methods.addAllComments = function(){
    // define starting count 
    var commentCount = 100;  //NOTE: using 100 as a test 
    // define recursive function 
    function tallyChildren(object){
        console.log("objcet:", object)
        if (object.comments){
            // add the number of children comments to the total 
            commentCount += object.comments.length;
            // for each child comment, find it in the database and peform the same function
            for (var i = 0; i < object.comments.length; i++){
                Comment.findOneById(  //NOTE: server side error b/c Comment is undefined 
                    object.comments[i]._id,  //find the comment by it's id
                    function(error, document){  //callback for what to do with the child  
                        if (error) {
                            console.log("error with CommentSchema.methods.totalComments");
                        } else {
                            tallyChildren(object.comments)
                        };
                    }
                );
            };
        };
    };
    // use the recursive function
    tallyChildren(this);
    // update the totalComments 
    this.totalComments = commentCount;
    // return the updated totalComments 
    return this.totalComments;
}

// create the mondel with the schema
var Article = mongoose.model("Article", ArticleSchema);

// export the model
module.exports = Article;