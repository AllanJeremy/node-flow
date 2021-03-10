const hbs = require("nodemailer-express-handlebars");
var path = require('path');

/**
 * Models
 */
const Models = require('../models');
const SystemSetting = Models.SystemSetting;

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

    const fromEmail = await SystemSetting.findOne({
      where: {
        name: 'from_email'
      }
    });

    const fromName = await SystemSetting.findOne({
      where: {
        name: 'from_name'
      }
    });

    const noreplyEmail = await SystemSetting.findOne({
      where: {
        name: 'noreply_email'
      }
    });

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
      from: fromName.value + " " + fromEmail.value,
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
