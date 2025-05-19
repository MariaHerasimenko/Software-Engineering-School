const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendConfirmationEmail = async (email, token) => {
  const confirmUrl = `http://localhost:3000/api/confirm/${token}`;
  await transporter.sendMail({
    from: '"Weather Bot" <no-reply@weatherapi.com>',
    to: email,
    subject: "Please confirm your subscription",
    html: `<p>Click <a href="${confirmUrl}">here</a> to confirm your subscription.</p>`,
  });
};
