const Post = require("../pkg/posts/postsSchema");
const User = require("../pkg/users/userSchema");

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

        let combined = [];
        for(let i = 0; i < posts.length; i++){
            let id = posts[i].author.toString();
            let author = await User.findById(id);
            let post = posts[i];
            let newItem = {
                postId: post._id,
                postContent: post.text,
                authorName: author.name,
                time: post.time
            };
            combined.push(newItem);
        }

        res.status(200).render("homepage", {
            status: "success",
            title: "The Office Chat App",
            subtitle: "Welcome to the news feed",
            posts: combined
        });
    }
    catch(err){
        res.status(500).send(err);
    }
};

//* Create post
exports.createPost = async (req, res) => {
    try{
        await Post.create({
            text: req.body.text,
            author: req.auth.id,
        });
        res.redirect("/homepage");
    }
    catch(err){
        res.status(500).send(err);
    }
};

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
        const posts = await Post.find({ author: req.auth.id });

        let combined = [];
        for(let i = 0; i < posts.length; i++){
            let id = posts[i].author.toString();
            let author = await User.findById(id);
            let post = posts[i];
            let newItem = {
                postId: post._id,
                postContent: post.text,
                authorName: author.name
            };
            combined.push(newItem);
        }

        res.status(200).render("profile", {
            status: "success",
            title: "My Profile",
            myPosts: combined,
        });
    }
    catch(err){
        res.status(500).send(err);
    }
};

//* View post details
exports.viewPostDetails = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        console.log(post);

        if(!post){
            res.status(404).send("The post is not found.")
        } else {
            res.status(200).render("postDetails", {
                status: "Success",
                post,
            });
        }
    }
    catch(err){
        res.status(500).send("Error with this page.")
    }
};

//* Update post
exports.updatePost = async (req, res) => {
    try{
        await Post.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/profile/" + req.params.id);
    }
    catch(err){
        res.status(500).send(err);
    }
}