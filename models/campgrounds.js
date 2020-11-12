var mongoose = require("mongoose");
var Comment = require("./comments");

var campgroundSchema = new mongoose.Schema({
    name : String,
    price: String,
    image: String,
    desc: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Campground",campgroundSchema);
