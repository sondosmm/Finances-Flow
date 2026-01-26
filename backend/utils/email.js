const nodemailer = require('nodemailer');
const ApiError = require('./apiError');
require('dotenv').config({ path: './config.env' });
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendEmail = async ({ to, subject, html, attachments = [] }) => {
    try {
        await transporter.sendMail({
        from: `Finance Flow <${process.env.EMAIL_USER}`,
        to,
        subject,
        html,
        attachments
    });
    }catch (err) {
        throw new ApiError("Failed to Send Email", 500);
    }
};
