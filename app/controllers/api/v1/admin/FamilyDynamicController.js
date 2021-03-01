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
const FamilyDynamic = Models.FamilyDynamic;

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


class FamilyDynamicController {

  /**
   * Returns the list of the family dynamic.
   *
   * @param Object req
   * @return Object res
   */
  list = (req, res) => {
    FamilyDynamic.findAll({order: [['id', 'DESC']]})
    .then(response => {
      return ResponseHandler.success(res, '', CommonTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * Creates a new family dynamic.
   *
   * @param Object req
   * @return Object res
   */
  store = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    FamilyDynamic.findOne({
      where: {
        name: req.body.name
      }
    }).then(response => {
      if (!response) {
        FamilyDynamic.create({
          name: req.body.name,
          status: req.body.status
        })
        .then(response => {
          return ResponseHandler.success(
            res, responseLanguage.family_dynamic_store_success, CommonTransformer.transform(response));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        })
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.family_dynamic_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * Updates the family dynamic sepcified by id.
   *
   * @param Object req
   * @return Object res
   */
  update = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    FamilyDynamic.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        FamilyDynamic.update({
          name: req.body.name,
          status: req.body.status,
        },
        {
          where: { id: req.params.id },
          returning: true
        })
        .then(result => {
          return ResponseHandler.success(
            res, responseLanguage.family_dynamic_update_success, CommonTransformer.transform(result));
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
   * Deletes the family dynamic.
   *
   * @param Object req
   * @return Object res
   */
  destroy = (req, res) => {
    FamilyDynamic.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        FamilyDynamic.destroy({ where: { id: req.params.id } })
        .then(response => {
          return ResponseHandler.success(res, responseLanguage.family_dynamic_delete_success);
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
}

module.exports = FamilyDynamicController;
