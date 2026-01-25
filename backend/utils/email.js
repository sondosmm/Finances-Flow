const nodemailer = require('nodemailer');
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
    await transporter.sendMail({
        from: `Finance Flow <${process.env.EMAIL_USER}`,
        to,
        subject,
        html,
        attachments
    });
};
