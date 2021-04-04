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
const SexualOrientation = Models.SexualOrientation;
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

class SexualOrientationController {

  /**
   * @api {get} /admin/sexual_orientation/list Handles sexual orientation list
   * @apiName Sexual orientation list
   * @apiGroup Admin
   *
   * @apiParam {String} [name] name
   * @apiParam {String} [status] status
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    SexualOrientation.findAll({order: [['id', 'DESC']]})
    .then(response => {
      return ResponseHandler.success(res, '', CommonTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /admin/sexual_orientation/store Handles sexualorientation store operation
   * @apiName Sexual orientation store
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

    SexualOrientation.findOne({
      where: {
        name: req.body.name
      }
    }).then(response => {
      if (!response) {
        SexualOrientation.create({
          name: req.body.name,
          status: req.body.status
        })
        .then(response => {
          return ResponseHandler.success(
            res, responseLanguage.sexual_orientation_store_success, CommonTransformer.transform(response));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        })
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.sexual_orientation_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {patch} /admin/sexual_orientation/update Handles sexual orientation update operation
   * @apiName Sexual orientation update
   * @apiGroup Admin
   *
   * @apiParam {String} [name] name
   * @apiParam {String} [status] status
   *
   * @apiSuccess (200) {Object}
   */
  update = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    SexualOrientation.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        SexualOrientation.update({
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
            SearchActivityHandler.store(SearchActivityAction.sexualOrientationRenamed, data);
          }

          return ResponseHandler.success(
            res, responseLanguage.sexual_orientation_update_success, CommonTransformer.transform(result));
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
   * @api {delete} /admin/sexual_orientation/destroy Handles sexual orientation destroy operation
   * @apiName Sexual orientation destroy
   * @apiGroup Admin
   *
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  destroy = (req, res) => {
    SexualOrientation.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        let name = response.name;

        SexualOrientation.destroy({ where: { id: req.params.id } })
        .then(response => {

          UserMetadata.update({
            sexual_orientation_id: null
          },{
            where: { sexual_orientation_id: req.params.id }
          });

          let data = {
            name: name
          }
          SearchActivityHandler.store(SearchActivityAction.sexualOrientationDelete, data);

          return ResponseHandler.success(res, responseLanguage.sexual_orientation_delete_success);
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
   * @api {post} /admin/sexual_orientation/merge Merge sexual orientation
   * @apiName Merge sexual orientation
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  merge = (req, res) => {
    SexualOrientation.findOne({
      where: {
        id: req.body.id
      }
    })
    .then(response => {
      UserMetadata.update({
          sexual_orientation_id: req.body.merged_id,
        },
        {
        where: { sexual_orientation_id: req.body.id },
        returning: true,
        plain: true
      })
      .then(response => {
        SexualOrientation.findOne({
          where: {
            id: req.body.merged_id
          }
        }).then(result => {
          let data = {
            id: response[1].dataValues.user_id,
            name: result.name
          }
          SearchActivityHandler.store(SearchActivityAction.sexualOrientationUpdate, data);
        });

        SexualOrientation.destroy({ where: { id: req.body.id }, force: true });
        return ResponseHandler.success(res, responseLanguage.sexual_orientation_merge_success);
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

module.exports = SexualOrientationController;
