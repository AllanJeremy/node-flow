require("dotenv").config();
const { validationResult } = require("express-validator");

/**
 * Helpers
 */
var ResponseHandler = require("../../../../helpers/ResponseHandler");
ResponseHandler = new ResponseHandler();

const StatusHandler = require("../../../../helpers/StatusHandler");

const ElasticsearchEventsAction = require("../../../../helpers/ElasticsearchEventsAction");

var ElasticsearchEventsHandler = require("../../../../helpers/ElasticsearchEventsHandler");
ElasticsearchEventsHandler = new ElasticsearchEventsHandler();

var ElasticSearchHandler = require("../../../../helpers/ElasticSearchHandler");
ElasticSearchHandler = new ElasticSearchHandler();

/**
 * Models
 */
const Models = require("../../../../models");
const Gender = Models.Gender;
const UserMetadata = Models.UserMetadata;

/**
 * Languages
 */
const language = require("../../../../language/en_default");
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
var CommonTransformer = require("../../../../transformers/core/CommonTransformer");
CommonTransformer = new CommonTransformer();

class GenderController {
  /**
   * @api {get} /user/profile/gender/list Show gender list
   * @apiName Gender list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    Gender.findAll({
      where: {
        status: StatusHandler.active,
      },
      order: [["name", "ASC"]],
    })
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
   * @api {post} /user/profile/gender/store Handles user profile gender store operation
   * @apiName Front user profile gender store operation
   * @apiGroup Front
   *
   * @apiParam {String} [gender] gender
   *
   * @apiSuccess (200) {Object}
   */
  store = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(
        res,
        422,
        validationLanguage.required_fields,
        errors.array()
      );
    }

    let isUserGenderExist = await UserMetadata.findOne({
      where: {
        user_id: req.id,
      },
      include: [
        {
          model: Gender,
          attributes: ["id", "name"],
          as: "gender",
          where: { status: StatusHandler.pending },
        },
      ],
      returning: true,
      raw: true,
    });
    if (req.body.other) {
      if (isUserGenderExist) {
        Gender.update(
          {
            name: req.body.other,
          },
          {
            where: {
              id: isUserGenderExist.gender_id,
            },
          }
        )
          .then((response) => {
            this.update(res, req.id, response.id, req.body.status);
          })
          .catch((err) => {
            return ResponseHandler.error(res, 500, err.message);
          });
      } else {
        Gender.create({
          name: req.body.other,
          status: StatusHandler.pending,
        })
          .then((response) => {
            this.update(res, req.id, response.id, StatusHandler.pending);
          })
          .catch((err) => {
            return ResponseHandler.error(res, 500, err.message);
          });
      }
    } else {
      if (isUserGenderExist) {
        Gender.destroy({
          where: {
            id: isUserGenderExist.gender_id,
          },
        });
      }

      if (!req.body.other && req.body.gender == "") {
        UserMetadata.update(
          {
            gender_id: 0,
            gender_status: 0,
          },
          {
            where: {
              user_id: req.id,
            },
          }
        );
      }

      if (req.body.gender) {
        Gender.findOne({
          where: {
            id: req.body.gender,
          },
        }).then((response) => {
          this.update(
            res,
            req.id,
            req.body.gender,
            req.body.status,
            response.name
          );
        });
      } else {
        return ResponseHandler.success(res, responseLanguage.gender_save);
      }
    }
  };

  update = (res, userId, genderId, status, name = "") => {
    UserMetadata.findOne({
      where: {
        user_id: userId,
      },
    })
      .then((response) => {
        if (!response) {
          UserMetadata.create({
            user_id: userId,
            gender_id: genderId,
            gender_status: status,
          })
            .then((response) => {
              if (status == StatusHandler.active) {
                this.updateElaticsearch(userId, name);
              }

              return ResponseHandler.success(res, responseLanguage.gender_save);
            })
            .catch((err) => {
              return ResponseHandler.error(res, 500, err.message);
            });
        } else {
          UserMetadata.update(
            {
              gender_id: genderId,
              gender_status: status,
            },
            {
              where: { user_id: userId },
            }
          )
            .then((response) => {
              if (status == StatusHandler.active) {
                this.updateElaticsearch(userId, name);
              }

              return ResponseHandler.success(res, responseLanguage.gender_save);
            })
            .catch((err) => {
              return ResponseHandler.error(res, 500, err.message);
            });
        }
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  updateElaticsearch = (userId, name) => {
    if (name) {
      let data = {
        id: userId,
        name: name,
      };

      ElasticsearchEventsHandler.store(
        ElasticsearchEventsAction.genderUpdate,
        data
      );

      ElasticSearchHandler.updateDocumentField(userId, {
        gender: name,
      });
    }
  };
}

module.exports = GenderController;
