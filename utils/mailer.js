const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, link) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Verify your email',
    html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
  });
};

const sendResetPasswordEmail = async (to, link) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset your password',
    html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
