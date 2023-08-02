//* Packages
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//* User schema, bluprint for the input
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name field is required."]
    },
    email: {
        type: String,
        required: [true, "E-mail is required."],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid e-mail."]
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [8, "Password must be at least 8 charachters long."],
        validate: [validator.isStrongPassword, "Please provide a strong password."]
    }
});

//* Middleware for hashing the password
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;