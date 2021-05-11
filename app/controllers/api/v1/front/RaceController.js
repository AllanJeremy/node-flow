require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const ElasticsearchEventsAction = require('../../../../helpers/ElasticsearchEventsAction');

var ElasticsearchEventsHandler = require('../../../../helpers/ElasticsearchEventsHandler');
ElasticsearchEventsHandler = new ElasticsearchEventsHandler();


/**
 * Models
 */
const Models = require('../../../../models');
const Race = Models.Race;
const UserMetadata = Models.UserMetadata;
const UserRace = Models.UserRace;

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
        this.update(req.id, response.id, StatusHandler.pending);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      })
    }

    if(req.body.races.length > 0 ) {
      var races = req.body.races;
      var status = req.body.status;
      races.map(async(item, index) => {
        this.update(req.id, item, status);
      });
    }
    return ResponseHandler.success(res, responseLanguage.race_save);
  }

  update = async (userId, raceId, status) => {
    let isUserRaceExist = await UserRace.findOne({
      where: {
        user_id: userId,
        race_id: raceId
      }
    });
    if (!isUserRaceExist) {
      UserRace.create({
        user_id: userId,
        race_id: raceId,
        status: status
      }).then(response => {
        UserRace.findAll({
          where: {
            user_id: userId
          },
          include: [{
            model: Race,
            attributes: ['name'],
            as: 'race',
            where: { status: StatusHandler.active }
          }],
          raw: true
        }).then(response => {
          if (response && response.length > 0) {
            let race = response.map(item => item['race.name']);
            let data = {
              id: userId,
              name: race
            }
            ElasticsearchEventsHandler.store(ElasticsearchEventsAction.raceUpdate, data);
          }
        });
      });
    }
  }

}

module.exports = RaceController;
