const nodemailer = require("nodemailer");
// Mailer configuration
const mailerClient = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com", // Default to Gmail SMTP
  port: process.env.MAIL_PORT || 587, // Use TLS-enabled port
  secure: false, // Use true for port 465, false for others
  auth: {
    user: process.env.MAIL_USER, // Your email address
    pass: process.env.MAIL_PASS, // Your email password or app password
  },
});

// Verify connection configuration mailerClient.verify((error, success) => { if (error) { console.error("Error connecting to mail server:", error.message); } else { console.log("Mailer client is ready to send emails!"); } });

module.exports = mailerClient;
