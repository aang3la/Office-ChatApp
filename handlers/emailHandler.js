//! npm install nodemailer
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    //* 1) Creating the transporter

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    transporter.verify((err, succ) => {
      if (err) {
        console.log(err);
      } else {
        console.log("success");
      }
    });

    //* 2) Defining the options of the email
    const mailOptions = {
      from: "Office Chat App <officeapp@hotmail.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    //* 3) Sending the email
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;