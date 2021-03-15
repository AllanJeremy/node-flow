require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

/**
 * Models
 */
const Models = require('../../../../models');
const User = Models.User;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;


class UserController {


  /**
   * @api {post} /profile/basic Handles user profile store operation
   * @apiName Front user profile store operation
   * @apiGroup Front
   *
   * @apiParam {String} [first_name] email
   * @apiParam {String} [name_prefix] password
   * @apiParam {String} [birth_date] birth_date
   *
   * @apiSuccess (200) {Object}
   */
  storeUserProfile = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    User.findOne({
      where: {
        id: req.id
      }
    }).then(response => {
      User.update({
        first_name: req.body.first_name,
        name_prefix: req.body.name_prefix,
        birth_date: req.body.birth_date,
        profile_picture: req.body.profile_picture,
      },
      {
        where: {id: response.id}
      })
      .then(response => {
        return ResponseHandler.success(res, responseLanguage.profile);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });


  }

}

module.exports = UserController;
