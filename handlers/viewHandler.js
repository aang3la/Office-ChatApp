const Post = require("../pkg/posts/postsSchema");

//* Default page
exports.getDefaultPage = (req, res) => {
    try{
        res.status(200).render("default", {
           title: "Welcome to The Office Chat App",
        });
    }
    catch(err){
        res.status(500).send("Error");
    }
};

//* Register form
exports.getRegisterForm = (req, res) => {
    try{
        res.status(200).render("register", {
           title: "The Office Chat App",
           subtitle: "Register here to use the app" 
        });
    }
    catch(err){
        res.status(500).send("Error");
    }
};

//* Login form
exports.getLoginForm = (req, res) => {
    try{
        res.status(200).render("login", {
            title: "The Office Chat App",
            subtitle: "USER LOGIN" 
        });
    }
    catch(err){
        res.status(500).send("Error");
    }
};

//* Homepage
exports.postsView = async (req, res) => {
    try{
        const posts = await Post.find();

        res.status(200).render("homepage", {
            status: "success",
            title: "The Office Chat App",
            subtitle: "Welcome to the news feed",
            posts,
        });
    }
    catch(err){
        res.status(500).send(err);
    }
};

//* Create post
exports.createPost = async (req, res) => {
    try{
        await Post.create(req.body);
        res.redirect("/homepage");
    }
    catch(err){
        res.status(500).send(err);
    }
};

//* Update post
exports.updatePost = async (req, res) => {
    try{
        await Post.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/homepage/" + req.params.id);
    }
    catch(err){
        res.status(500).send(err);
    }
}

//* Delete post
exports.deletePost = async (req, res) => {
    try{
        const postId = req.params.id;
        await Post.findByIdAndDelete(postId);
        res.redirect("/homepage");
    }
    catch(err){
        res.status(500).send(err);
    }
}

//* My profile
exports.myProfile = async (req, res) => {
    try{
        const myPosts = await Post.find({ author: userId });

        res.status(200).render("profile", {
            status: "success",
            title: "My Profile",
            myPosts,
        });
    }
    catch(err){
        res.status(500).send(err);
    }
};
