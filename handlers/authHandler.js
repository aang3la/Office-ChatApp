//* Connecting with the schema
const User = require("../pkg/users/userSchema");

//* Packages
const jwt = require("express-jwt");
const bcrypt = require("bcryptjs");

//* Register function
exports.register = async (req, res) => {
    try{
        // Creating new user
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });

        // Generating token
        const token = jwt.sign(
            {id: newUser._id, name: newUser.name},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES}
        );

        res.status(201).json({
            status: "Success",
            token,
            data: {
                user: newUser
            }
        });
    }
    catch(err){
        res.status(500).send(err);
    }
};

//* LogIn function
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        // Are we have information in the inputs
        if(!email || !password){
            return res.status(400).send("Please provide an email and password.")
        };

        // Is user exists
        const user = await User.findOne({email});
        if(!user) { 
            return res.status(400).send("This user with this email doesn't exist.")
        }

        // Comparing passwords
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if(!isPasswordValid){
            return res.status(400).send("Ivalid email or password.")
        }

        // If everything is ok, the token is generating
        const token = jwt.sign(
            {id: user._id, name: user.name},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES});

        // Send the cookies with the token
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000),
            secure: false,
            httpOnly: true
        });

        // Send the token
        res.status(201).json({
            status: "Success",
            token
        });
    }
    catch(err){
        res.status(500).send(err);
    }
}