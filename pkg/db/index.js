//* Packages
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//* Configure the space
dotenv.config({path: `${__dirname}/../../config.env`});

//* Replacing the password in the database url
const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

//* Connecting the database
exports.init = async () => {
    try{
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Successfully connected to the database.")
    }
    catch(err){
        console.log(err);
    }
}