const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

/**
 * Helpers
 */
const { ResponseHandler } = require("../../../../helpers");

/**
 * Models
 */
const { Avatar } = require("../../../../models");

/**
 * Transformers
 */
const { AvatarTransformer } = require("../../../../transformers/admin");

/**
 * Languages
 */
const language = require("../../../../language/en_default");
const responseLanguage = language.en.admin.response;

class AvatarController {
  /**
   * @api {get} /api/avatar/list Show avatar list
   * @apiName Front avatar list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    Avatar.findAll({ order: [["id", "DESC"]] })
      .then((response) => {
        return ResponseHandler.success(
          res,
          "",
          AvatarTransformer.transform(response)
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {post} /api/avatar/store Handle avatar store operation
   * @apiName Admin avatar store
   * @apiGroup Admin
   *
   * @apiParam {String} [name] name
   * @apiParam {String} [status] status
   *
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

    Avatar.create({
      name: req.name,
      status: req.body.status,
    })
      .then((response) => {
        return ResponseHandler.success(
          res,
          responseLanguage.avatar_store_success,
          AvatarTransformer.transform(response)
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {patch} /admin/avatar/update Handles avatar update operation
   * @apiName Avatar update
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

    Avatar.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((response) => {
        if (response) {
          Avatar.update(
            {
              name: req.name ? req.name : response.name,
              status: req.body.status,
            },
            {
              where: { id: req.params.id },
              returning: true,
            }
          )
            .then((result) => {
              return ResponseHandler.success(
                res,
                responseLanguage.avatar_update_success,
                AvatarTransformer.transform(result)
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
   * @api {delete} /admin/avatar/destroy Handles avatar destroy operation
   * @apiName Avatar destroy
   * @apiGroup Admin
   *
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  destroy = (req, res) => {
    Avatar.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((response) => {
        if (response) {
          let name = response.name;

          Avatar.destroy({ where: { id: req.params.id } })
            .then((response) => {
              fs.unlink(path.join("images/avatar/" + name), function () {});
              return ResponseHandler.success(
                res,
                responseLanguage.avatar_delete_success
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
}

module.exports = AvatarController;
