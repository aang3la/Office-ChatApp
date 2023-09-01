const nodemailer = require("nodemailer");

exports.sendEmail = async (req, res) => {
    try{
        //* 1) Creating the transport with mailtrap
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        transporter.verify((err, succ) => {
            if(err){
                console.log(err);
            } else {

                console.log('Success!');
            }
        });

        //* 2) Define the options for the email
        const mailOptions = {
            from: "Office Chat App <office.app@gmail.com>",
            to: options.email,
            subject: options.subject,
            text: options.message
        };

        //* 3) Sending the email
        await transporter.sendMail(mailOptions);
    }catch(err){
        console.log(err);
    }
};