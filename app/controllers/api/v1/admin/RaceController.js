const { validationResult } = require('express-validator');

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

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
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

/**
 * Transformers
 */
var CommonTransformer = require('../../../../transformers/core/CommonTransformer');
CommonTransformer = new CommonTransformer();


class RaceController {

  /**
   * @api {get} /admin/race/list Show race list
   * @apiName Race list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    Race.findAll({order: [['id', 'DESC']]})
    .then(response => {
      return ResponseHandler.success(res, '', CommonTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /admin/race/store Handles race store operation
   * @apiName Race store
   * @apiGroup Admin
   *
   * @apiParam {String} [name] name
   * @apiParam {String} [status] status
   *
   * @apiSuccess (200) {Object}
   */
  store = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    Race.findOne({
      where: {
        name: req.body.name
      }
    }).then(response => {
      if (!response) {
        Race.create({
          name: req.body.name,
          status: req.body.status
        })
        .then(response => {
          return ResponseHandler.success(
            res, responseLanguage.race_store_success, CommonTransformer.transform(response));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        })
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.race_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {patch} /admin/race/update Handles race update operation
   * @apiName Race update
   * @apiGroup Admin
   *
   * @apiParam {String} [name] name
   * @apiParam {String} [status] status
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  update = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    Race.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        Race.update({
          name: req.body.name,
          status: req.body.status,
        },
        {
          where: { id: req.params.id },
          returning: true
        })
        .then(result => {

          if(response.name != req.body.name) {
            let data = {
              old_name: response.name,
              name: req.body.name
            }
            SearchActivityHandler.store(SearchActivityAction.raceRenamed, data);
          }

          return ResponseHandler.success(
            res, responseLanguage.race_update_success, CommonTransformer.transform(result));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.not_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {delete} /admin/race/destroy Handles race destroy operation
   * @apiName Race destroy
   * @apiGroup Admin
   *
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  destroy = (req, res) => {
    Race.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        let name = response.name;

        Race.destroy({ where: { id: req.params.id } })
        .then(response => {

          UserMetadata.update({
            race_id: null
          },{
            where: { race_id: req.params.id }
          });

          let data = {
            name: name
          }
          SearchActivityHandler.store(SearchActivityAction.raceDelete, data);

          return ResponseHandler.success(res, responseLanguage.race_delete_success);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.not_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /admin/race/merge Merge race
   * @apiName Merge race
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  merge = (req, res) => {
    Race.findOne({
      where: {
        id: req.body.id
      }
    })
    .then(response => {
      UserMetadata.update({
          race_id: req.body.merged_id,
        },
        {
        where: { race_id: req.body.id },
        returning: true,
        plain: true
      })
      .then(response => {

        Race.findOne({
          where: {
            id: req.body.merged_id
          }
        }).then(result => {
          let data = {
            id: response[1].dataValues.user_id,
            name: result.name
          }
          SearchActivityHandler.store(SearchActivityAction.raceUpdate, data);
        });

        Race.destroy({ where: { id: req.body.id }, force: true });
        return ResponseHandler.success(res, responseLanguage.race_merge_success);
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

module.exports = RaceController;
