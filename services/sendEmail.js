const nodemailer = require("nodemailer");


const sendEmail = async (options, job) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });
    const mailOptions = {
        from: "Bijay Shrestha <bijayshrestha0817@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: "Your otp is  " + options.otp,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail
