require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const SearchActivityAction = require('../../../../helpers/SearchActivityAction');

var SearchActivityHandler = require('../../../../helpers/SearchActivityHandler');
SearchActivityHandler = new SearchActivityHandler();


/**
 * Models
 */
const Models = require('../../../../models');
const Race = Models.Race;
const UserMetadata = Models.UserMetadata;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
var CommonTransformer = require('../../../../transformers/core/CommonTransformer');
CommonTransformer = new CommonTransformer();


class RaceController {

  /**
   * @api {get} /user/profile/race/list Show race list
   * @apiName Race list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    Race.findAll({
      where: {
        status: StatusHandler.active
      }
    , order: [['id', 'DESC']]})
    .then(response => {
      return ResponseHandler.success(res, '', CommonTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /user/profile/race/store Handles user profile race store operation
   * @apiName Front user profile race store operation
   * @apiGroup Front
   *
   * @apiParam {String} [race] race
   *
   * @apiSuccess (200) {Object}
   */
  store = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    if (req.body.other) {
      Race.create({
        name: req.body.other,
        status: StatusHandler.pending
      },
      {
        returning: true,
        raw:true
      })
      .then(response => {
        this.update(res, req.id, response.id);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      })
    } else {
      Race.findOne({
        where: {
          id: req.body.race
        }
      }).then(response => {
        this.update(res, req.id, req.body.race, response.name);
      });
    }

  }

  update = (res, userId, raceId, name = '') => {
    UserMetadata.findOne({
      where: {
        user_id: userId
      }
    }).then(response => {
      if(!response) {
        UserMetadata.create({
          user_id: userId,
          race_id: raceId
        })
        .then(response => {
          if (name) {
            let data = {
              id: userId,
              name: name
            }

            SearchActivityHandler.store(SearchActivityAction.raceUpdate, data);
          }

          return ResponseHandler.success(res, responseLanguage.race_save);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        UserMetadata.update({
          race_id: raceId
        },{
          where: {user_id: userId}
        })
        .then(response => {

          if (name) {
            let data = {
              id: userId,
              name: name
            }

            SearchActivityHandler.store(SearchActivityAction.raceUpdate, data);
          }

          return ResponseHandler.success(res, responseLanguage.race_save);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = RaceController;
