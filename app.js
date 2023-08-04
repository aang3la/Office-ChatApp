//* Packages
const express = require ("express");
const db = require("./pkg/db/index");
const jwt = require("express-jwt");
const cookieParser = require("cookie-parser");

//* Handlers
const authHandler = require("./handlers/authHandler");
const viewHandler = require("./handlers/viewHandler");
const postsHandler = require("./handlers/postsHandler");

const app = express();

//* Middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

//* Connecting with the database
db.init();

app.use(jwt.expressjwt({
    algorithms: ["HS256"],
    secret: process.env.JWT_SECRET,
    getToken: (req) => {
        if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            return req.headers.authorization.split(" ")[1];
        }
        if(req.cookies.jwt) {
            return req.cookies.jwt;
        }
        return null;
    }})
    .unless({
        path: ["/api/register", "/api/login"]
    })
);

//* Authentication routes
app.post("/api/register", authHandler.register);
app.post("/api/login", authHandler.login);

//* Posts handler routes
app.get("/posts", postsHandler.allPosts);
app.get("/myposts", postsHandler.myPosts);
app.post("/posts", postsHandler.createMyPost);
app.patch("/posts/:id", postsHandler.updatePost);
app.delete("/posts/:id", postsHandler.deletePost);

//* View routes
app.get("/register", viewHandler.getRegisterForm);
app.get("/login", viewHandler.getLoginForm);


app.listen(process.env.PORT, (err) => {
    if(err){
        return console.log("Couldn't start the service.");
    }
    console.log(`Server started successfully on port ${process.env.PORT}`);
})
