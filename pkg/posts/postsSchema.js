const mongoose = require("mongoose");

//* Blueprint for the posts
const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "You can't post empty status."]
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    time: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;