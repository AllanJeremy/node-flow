const hbs = require('nodemailer-express-handlebars');
var path = require('path');

/**
 * Configs
 */
const config = require('../config/email.config.js');


/**
 * Languages
 */
const language = require('../language/en_default');
const emailLanguage = language.en.email;

/**
 * Mail Transporter
 */
const MailTransporter = require('./MailTransporter.js');


/**
 * Manages send mail across the system
 *
 * @class MailHandler
 * @package app
 * @subpackage helpers
 */
class MailHandler {



  /**
   * Used for sending mail
   *
   * @param {String} template
   * @param {String} message
   * @param {String} to
   */
  send = async(template, message, to, cc = '', bcc = '') => {

    switch (template) {
      case 'email_verification':
        message['subject'] = 'Email Verification';
        message['params']['line1'] = emailLanguage.register.line1;
        message['params']['line2'] = emailLanguage.register.line2;
        break;

      case 'reset_password':
        message['subject'] = 'Reset Password';
        message['params']['line1'] = emailLanguage.reset_password.line1;
        break;

      default:
        break;
    }

    const options = {
      viewEngine: {
        partialsDir: path.resolve(__dirname, '../views/email/layouts'),
        layoutsDir: path.resolve(__dirname, '../views/email/layouts'),
        extname: '.hbs'
      },
      extName: '.hbs',
      viewPath: path.resolve(__dirname, '../views/email')
    };
    MailTransporter.use('compile', hbs(options));

    const mailData = {
      from: config.email.notification.from_name + ' ' + config.email.notification.from_email,
      to: to,
      subject: message['subject'],
      template: template,
      context: message['params']
    };

    MailTransporter.sendMail(mailData, (error, info) => {
      if (error) {
        return false;
      }
      return true;
    });
  }
}


module.exports = MailHandler;
