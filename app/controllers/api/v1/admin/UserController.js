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
const UserMetadata = Models.UserMetadata;
const Race = Models.Race;
const Gender = Models.Gender;
const SexualOrientation = Models.SexualOrientation;
const FamilyDynamic = Models.FamilyDynamic;
const HealthCategory = Models.HealthCategory;
const UserHealthCategory = Models.UserHealthCategory;
const Workout = Models.Workout;
const UserWorkout = Models.UserWorkout;
const PersonalityQuestion = Models.PersonalityQuestion;
const PersonalityOption = Models.PersonalityOption;
const UserPersonalityQuestion = Models.UserPersonalityQuestion;
const ConversationStarter = Models.ConversationStarter;
const UserConversationStarter = Models.UserConversationStarter;


/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

/**
 * Transformers
 */
var UserTransformer = require('../../../../transformers/admin/UserTransformer');
UserTransformer = new UserTransformer();


class UserController {

  /**
   * @api {get} /admin/user/list Show user list
   * @apiName User list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    User.findAll({
      order: [['id', 'DESC']],
      attributes: ['id', 'email', 'first_name', 'status']
    })
    .then(response => {
      return ResponseHandler.success(res, '', UserTransformer.UserList(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {get} /admin/user/show/:id Show user detail
   * @apiName Show user detail
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  show = (req, res) => {
    User.findOne({
      where: {id: req.params.id},
      include: [
      {
        model: UserMetadata,
        include: [
          { model: Race, attributes: ['name'] },
          { model: Gender, attributes: ['name'] },
          { model: SexualOrientation, attributes: ['name'] },
          { model: FamilyDynamic, attributes: ['name'] }],
        as: 'user_meta_data'
      },
      {
        model: UserHealthCategory,
        attributes: ['id', 'user_id', 'health_category_id'],
        include: [{
            model: HealthCategory,
            attributes: ['name'],
            as: 'health_category'
          }],
        as: 'health_categories'
      },
      {
        model: UserWorkout,
        attributes: ['id', 'user_id', 'workout_id'],
        include: [{
          model: Workout,
          attributes: ['name'],
          as: 'workout'
        }],
        as: 'workouts'
      },
      {
        model: UserPersonalityQuestion,
        attributes: ['id', 'user_id', 'question_id', 'option_id'],
        include: [{
          model: PersonalityQuestion,
          attributes: ['question', 'id'],
          as: 'personality_question',
          include: [{ 
             model: PersonalityOption,
              as: 'personality_options',
              attributes: ['option', 'caption'],
          }]
        },
        {
          model: PersonalityOption,
          attributes: ['option', 'id'],
          as: 'user_option',
        }
        ],
        as: 'personality_questions'
      },
      {
      model: UserConversationStarter,
        attributes: ['id', 'user_id', 'conversation_starter_id', 'answer'],
        include: [{
          model: ConversationStarter,
          attributes: ['question'],
          as: 'conversation_starter'
        }],
        as: 'conversation_starters'
      }]
    })
    .then(response => {
      return ResponseHandler.success(res, '', UserTransformer.UserDetail(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /admin/user/update/status Update user status
   * @apiName Update user status
   * @apiGroup Admin
   *
   * @apiParam {Integer} [user_id] user_id
   * @apiParam {Integer} [status] status
   *
   * @apiSuccess (200) {Object}
   */
  updateStatus = (req, res) => {
    User.findOne({
      where: {id: req.body.user_id}
    })
    .then(response => {
      User.update({
        status: req.body.status
      },{
        where: {id: response.id}
      })
      return ResponseHandler.success(res, responseLanguage.user_status_change);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = UserController;
