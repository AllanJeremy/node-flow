var nodemailer = require("nodemailer");

/**
 * Reusable transporter object using the default SMTP transport
 *
 */
const MailTransporter = nodemailer.createTransport({
  port: process.env.EMAIL_SERVICE_PORT,
  host: process.env.EMAIL_SERVICE_HOST,
  auth: {
    user: process.env.EMAIL_USER_NAME,
    pass: process.env.EMAIL_USER_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
  secure: process.env.EMAIL_SERVICE_SECURE,
});

module.exports = MailTransporter;
