const Post = require("../pkg/posts/postsSchema");

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
        });
    }
    catch(err){
        res.status(500).send("Error");
    }
};

