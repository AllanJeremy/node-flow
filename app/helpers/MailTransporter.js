var nodemailer = require('nodemailer');

/**
 * Reusable transporter object using the default SMTP transport
 *
 */
const MailTransporter = nodemailer.createTransport({
  port: process.env.GMAIL_SERVICE_PORT,
  host: process.env.GMAIL_SERVICE_HOST,
  auth: {
    user: process.env.GMAIL_USER_NAME,
    pass: process.env.GMAIL_USER_PASSWORD,
  },
  tls:{
    ciphers:'SSLv3'
  },
  secure: process.env.GMAIL_SERVICE_SECURE,
});

module.exports = MailTransporter;
