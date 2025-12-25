const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // REQUIRED for 465
  auth: {
    user: "bitsorter.team@gmail.com",
    pass: process.env.GOOGLE_APP_PASS, // APP PASSWORD
  },
});

module.exports = transporter;

// (async () => {
//   const info = await transporter.sendMail({
//     from: '"BitSorter Team" <bitsorter.team@gmail.com>',
//     to: "vaineerochan13@gmail.com", // your email for testing
//     subject: "Verify your BitSorter account",
//     text: "This is a test email from BitSorter.",
//     html: "<b>This is a test email from BitSorter.</b>",
//   });

//   console.log("Message sent:", info.messageId);
// })();
