const { validationResult } = require("express-validator");

/**
 * Helpers
 */
const {
  ElasticsearchEventsAction,
  ElasticsearchEventsHandler,
  ResponseHandler,
} = require("../../../../helpers");

/**
 * Models
 */
const { Gender, UserMetadata } = require("../../../../models");

/**
 * Languages
 */
const language = require("../../../../language/en_default");
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

/**
 * Transformers
 */
const { CommonTransformer } = require("../../../../transformers/core");

class GenderController {
  /**
   * @api {post} /admin/gender/list Handles gender list
   * @apiName Gender list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    Gender.findAll({ order: [["id", "DESC"]] })
      .then((response) => {
        return ResponseHandler.success(
          res,
          "",
          CommonTransformer.transform(response)
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {post} /admin/gender/store Handles gender store operation
   * @apiName Gender store
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
      return ResponseHandler.error(
        res,
        422,
        validationLanguage.required_fields,
        errors.array()
      );
    }

    Gender.findOne({
      where: {
        name: req.body.name,
      },
    })
      .then((response) => {
        if (!response) {
          Gender.create({
            name: req.body.name,
            status: req.body.status,
          })
            .then((response) => {
              return ResponseHandler.success(
                res,
                responseLanguage.gender_store_success,
                CommonTransformer.transform(response)
              );
            })
            .catch((err) => {
              return ResponseHandler.error(res, 500, err.message);
            });
        } else {
          return ResponseHandler.error(res, 400, responseLanguage.gender_exist);
        }
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {post} /admin/gender/update Handles gender update operation
   * @apiName Gender update
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
      return ResponseHandler.error(
        res,
        422,
        validationLanguage.required_fields,
        errors.array()
      );
    }

    Gender.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((response) => {
        if (response) {
          Gender.update(
            {
              name: req.body.name,
              status: req.body.status,
            },
            {
              where: { id: req.params.id },
              returning: true,
            }
          )
            .then((result) => {
              if (response.name != req.body.name) {
                let data = {
                  old_name: response.name,
                  name: req.body.name,
                };
                ElasticsearchEventsHandler.store(
                  ElasticsearchEventsAction.genderRenamed,
                  data
                );
              }

              return ResponseHandler.success(
                res,
                responseLanguage.gender_update_success,
                CommonTransformer.transform(result)
              );
            })
            .catch((err) => {
              return ResponseHandler.error(res, 500, err.message);
            });
        } else {
          return ResponseHandler.error(res, 400, responseLanguage.not_exist);
        }
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {post} /admin/gender/destroy Handles gender destroy operation
   * @apiName Gender destroy
   * @apiGroup Admin
   *
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  destroy = (req, res) => {
    Gender.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((response) => {
        if (response) {
          let name = response.name;

          Gender.destroy({ where: { id: req.params.id } })
            .then((response) => {
              UserMetadata.update(
                {
                  gender_id: null,
                },
                {
                  where: { gender_id: req.params.id },
                }
              );

              let data = {
                name: name,
              };
              ElasticsearchEventsHandler.store(
                ElasticsearchEventsAction.genderDelete,
                data
              );

              return ResponseHandler.success(
                res,
                responseLanguage.gender_delete_success
              );
            })
            .catch((err) => {
              return ResponseHandler.error(res, 500, err.message);
            });
        } else {
          return ResponseHandler.error(res, 400, responseLanguage.not_exist);
        }
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {post} /admin/race/merge Merge gender
   * @apiName Merge gender
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  merge = (req, res) => {
    Gender.findOne({
      where: {
        id: req.body.id,
      },
    })
      .then((response) => {
        UserMetadata.findAll({ where: { gender_id: req.body.id } })
          .then((response) => {
            if (response.length > 0) {
              UserMetadata.update(
                {
                  gender_id: req.body.merged_id,
                },
                {
                  where: { gender_id: req.body.id },
                  returning: true,
                  plain: true,
                }
              )
                .then((response) => {
                  Gender.findOne({
                    where: {
                      id: req.body.merged_id,
                    },
                  }).then((result) => {
                    let data = {
                      id: response[1].dataValues.user_id,
                      name: result.name,
                    };
                    ElasticsearchEventsHandler.store(
                      ElasticsearchEventsAction.genderUpdate,
                      data
                    );
                  });
                })
                .catch((err) => {
                  return ResponseHandler.error(res, 500, err.message);
                });
            }
            Gender.destroy({ where: { id: req.body.id }, force: true });
            return ResponseHandler.success(
              res,
              responseLanguage.gender_merge_success
            );
          })
          .catch((err) => {
            return ResponseHandler.error(res, 500, err.message);
          });
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };
}

module.exports = GenderController;
