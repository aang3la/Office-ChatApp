const Post = require("../pkg/posts/postsSchema");

//* Show all posts
exports.allPosts = async(req, res) => {
    try{
        const queryObj  = {...req.query}
        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        const query = JSON.parse(queryString)

        const posts = await Post.find(query);

        res.status(200).json({
            status: "Success",
            data: {
                posts
            }
        })
    }
    catch(err){
        res.status(500).json({ error: err });
    }
};

//* Show one post
exports.getOne = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json({
            status: "Success",
            data: {post}
        });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}

//* Show only MY posts
exports.myPosts = async (req, res) => {
    try{
        const userId = req.auth.id;
        const minePosts = await Post.find({author: userId});
        res.status(201).json(minePosts);
    }
    catch(err){
        res.status(500).json({ error: err });
    }
};

//* Create post from user
exports.createMyPost = async (req, res) => {
    try{
        const createPost = await Post.create({
            text: req.body.text,
            author: req.auth.id,
        });
        res.status(201).json(createPost);
    }
    catch(err){
        res.status(500).json({ error: err});
    }
};

//* Make changes in the post
exports.updatePost = async (req, res) => {
    try{
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "Success",
            data: post
        });
    }
    catch(err){
        res.status(500).json({error: err});
    }
};

//* Delete my post
exports.deletePost = async (req, res) => {
    try{
        await Post.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "Success",
            data: null,
        });
    }
    catch(err){
        res.status(500).json({error: err});
    }
};