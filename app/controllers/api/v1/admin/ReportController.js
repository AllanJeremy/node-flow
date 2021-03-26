require('dotenv').config();
const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const ReportReasonHandler = require('../../../../helpers/ReportReasonHandler');

/**
 * Models
 */
const Models = require('../../../../models');
const ReportedUser = Models.ReportedUser;
const User = Models.User;


/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
var ReportTransformer = require('../../../../transformers/admin/ReportTransformer');
ReportTransformer = new ReportTransformer();


class ReportController {

  /**
   * @api {get} /admin/reported_users/list Show reported users list
   * @apiName reported users list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  userList = (req, res) => {
    ReportedUser.findAll({
      include: [{
        model: User,
        attributes: ['id', 'first_name', 'email'],
        as: 'reported_user'
      },
      {
        model: User,
        attributes: ['id', 'first_name', 'email'],
        as: 'reported_by_user'
      }],
      order: [['id', 'DESC']]
    })
    .then(response => {
      return ResponseHandler.success(res, '', ReportTransformer.users(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {get} /admin/reported_users/new Show count of new reported users 
   * @apiName new reported users count
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  newUser = (req, res) => {
    ReportedUser.count({
      where: { status: false },
      include: [{
        model: User,
        attributes: ['id', 'first_name', 'email'],
        as: 'reported_user'
      },
      {
        model: User,
        attributes: ['id', 'first_name', 'email'],
        as: 'reported_by_user'
      }],
      order: [['id', 'DESC']]
    })
    .then(response => {
      return ResponseHandler.success(res, '', response);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {get} /admin/reported_users/read || /admin/reported_users/unread Handles reported users status read/unread operation 
   * @apiName reported users status read/unread operation
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  status = (req, res) => {
    ReportedUser.update({
      status: Sequelize.literal('NOT status')
    },
    {
      where: { id: req.params.id },
      returning: true
    })
    .then(response => {
      return ResponseHandler.success(res, '', response);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = ReportController;
