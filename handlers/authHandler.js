//* Connecting with the schema
const User = require("../pkg/users/userSchema");

//* Packages
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("./emailHandler");
const crypto = require("crypto");

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

        // Generating cookies
        res.cookie("jwt", token, {
              expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              secure: false,
              httpOnly: true,
        });

        //* Sending email after signup - register
        await sendEmail({
            email: newUser.email,
            subject: "Thank you for the registration!",
            message: "We thank you for the trust and support for choosing us."
        });

        res.status(201).json({
            status: "Success",
            token,
            data: {user: newUser}
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
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            secure: false,
            httpOnly: true
        });

        // Send the token
        res.status(201).json({
            status: "Success",
            token,
            data: {user: user}
        });
    }
    catch(err){
        res.status(500).send(err);
    }
};

//* Forgot password feature with crypto module
exports.forgotPassword = async (req, res) => {
    try{
        //* 1) Searching the user with his email
        const user = await User.findOne({ email: req.body.email });
        if(!user) throw new Error("This user doesn't exist.");
        console.log(user);

        //* 2) Generating reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        //* 3) Writing the reset token in database
        user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.passwordResetExpires = Date.now() + 30 * 60 * 1000; //time for changing the pass
        await user.save({ validateBeforeSave: false });

        //* 4) Sending the link to the user email
        const resetUrl = `${req.protocol}://${req.get("hoset")}/resetPassword/${resetToken}`;
        const message = `Hello ${user.name}. Please use Patch request with your new password. This is the reset url: ${resetUrl}`;
        const subject = "Forgot your password?"

        await sendEmail({
            email: user.email,
            subject: subject,
            message: message,
        });

        res.status(200).json({
            status: "Success",
            message: "Token is sent to the email."
        });
    } catch(err) {
        res.status(500).send(err);
    }
};

//* Reset password
exports.resetPassword = async(req, res) => {
    try{
        const resetToken = req.params.token;

        //* 1) Getting the document that has that token
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        //* 2) Searching in the collection if the user exist with this token
        const user = await User.findOne({ 
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        //* 3) And here we are checking in case it can't find the user
        if(!user) throw new Error("Token is invalid or expired.");

        user.password = req.body.password;
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;

        await user.save();

        //* 4) Sending the token and cookies
        const token = jwt.sign(
            { id: user._id, name: user.name },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES,
            }
        );

        res.cookie("jwt", token, {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            secure: false,
            httpOnly: true,
          });
      
          res.status(201).json({
            status: "success",
            token,
          });
    }catch(err) {
        res.status(500).send(err);
    }
};