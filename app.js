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
        path: ["/default", "/register", "/login"]
    })
);

app.listen(process.env.PORT, (err) => {
    if(err){
        return console.log("Couldn't start the service.");
    }
    console.log(`Server started successfully on port ${process.env.PORT}`);
})
