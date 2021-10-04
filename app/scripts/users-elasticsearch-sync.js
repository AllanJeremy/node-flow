const SystemConstants = require('../config/constants.js');

const ElasticsearchEventsAction = require('../helpers/ElasticsearchEventsAction');

var ElasticsearchEventsHandler = require("../helpers/ElasticsearchEventsHandler");
ElasticsearchEventsHandler = new ElasticsearchEventsHandler();

var ElasticSearchHandler = require("../helpers/ElasticSearchHandler");
ElasticSearchHandler = new ElasticSearchHandler();

/**
 * Models
 */
const Models = require('../models');
const User = Models.User;
const UserMetadata = Models.UserMetadata;
const UserInterest = Models.UserInterest;
const Race = Models.Race;
const Gender = Models.Gender;
const SexualOrientation = Models.SexualOrientation;
const FamilyDynamic = Models.FamilyDynamic;
const HealthCategory = Models.HealthCategory;
const UserHealthCategory = Models.UserHealthCategory;
const Workout = Models.Workout;
const UserWorkout = Models.UserWorkout;
const UserRace = Models.UserRace;
const UserFamilyDynamic = Models.UserFamilyDynamic;
const PersonalityQuestion = Models.PersonalityQuestion;
const UserPersonalityQuestion = Models.UserPersonalityQuestion;
const ConversationStarter = Models.ConversationStarter;
const UserConversationStarter = Models.UserConversationStarter;
const UserMatchingPreference = Models.UserMatchingPreference;
const UserSetting = Models.UserSetting;
const ListedPeer = Models.ListedPeer;
const UserHealthJourney = Models.UserHealthJourney;

const StatusHandler = require('../helpers/StatusHandler');

/**
 * Manages Active Campaign hooks
 *
 * @class EmailEvents
 * @package app
 * @subpackage helpers
 */
class UsersElasticSearchSync {

  index = () => {
    User.findAll({
      limit: 5
    }).then(async users => {
      users.map(async(item) => {
        var userId = item.id;
        let userData = {
          id: userId
        }
        await ElasticSearchHandler.addDocument(userId, userData);

        // sync user detail
        UserMetadata.findOne({
          where: {
            user_id: userId
          }
        }).then(async userDetail => {
          let data = {
            id: userId,
            name: item.first_name,
            profile_picture: item.profile_picture,
            unique_id: item.unique_id,
          };
          await ElasticSearchHandler.updateDocumentField(userId, data);

          //sync user health categories
          UserHealthCategory.findAll({
            attributes: ['health_category_id'],
            where: {
              user_id: userId
            },
            include: [{
              model: HealthCategory,
              attributes: ['id', 'name'],
              as: 'health_category'
            }]
          }).then(async userHealthCategories => {
            if(userHealthCategories.length > 0) {
              let healthCategoriesName = userHealthCategories.map(item => {
              return  item.health_category.name
            });

            await ElasticSearchHandler.updateDocumentField(userId, {
              health_categories: healthCategoriesName
            });
            }
          });

          //sync user workouts
          UserWorkout.findAll({
            attributes: ['workout_id'],
            where: {
              user_id: userId
            },
            include: [{
              model: Workout,
              attributes: ['id', 'name'],
              as: 'workout',
            }]
          }).then(async workouts => {
            if(workouts.length > 0) {
              let workoutsName = workouts.map(item => item.workout.name);
              // await ElasticSearchHandler.updateDocumentField(userId, {
              //   workouts: workoutsName
              // });
            }
          });

          //sync user races
          UserRace.findAll({
            where: {
              user_id: userId,
              status: StatusHandler.active
            },
            include: [{
              model: Race,
              attributes: ['id', 'name'],
              as: 'race'
            }],
            returning: true,
            raw: true
          }).then(async races => {
            if(races.length > 0) {
              let racesName = races.map(item => {return item['race.name']});
              await ElasticSearchHandler.updateDocumentField(userId, {
                race: racesName
              });
            }
          });

          //sync user gender
          if(userDetail) {
            Gender.findOne({
              where: {
                id: userDetail.gender_id
              }
            }).then(async gender => {
              if(gender){
                await ElasticSearchHandler.updateDocumentField(userId, {
                  gender: gender.name
                });
              }
            });
          }

          //sync sexual orientation
          if(userDetail) {
            SexualOrientation.findOne({
              where: {
                id: userDetail.sexual_orientation_id
              }
            }).then(async sexualOrientation => {
              if(sexualOrientation){
                await ElasticSearchHandler.updateDocumentField(userId, {
                  sexual_orientation: sexualOrientation.name
                });
              }
            });
          }

          //sync user family dynamic
          UserFamilyDynamic.findAll({
            where: {
              user_id: userId,
              status: StatusHandler.active
            },
            include: [{
              model: FamilyDynamic,
              attributes: ['id', 'name'],
              as: 'family_dynamic'
            }],
            returning: true,
            raw: true
          }).then(async familyDynamics => {
            if(familyDynamics.length > 0) {
              let familyDynamicsName = familyDynamics.map(item => item['family_dynamic.name']);
              await ElasticSearchHandler.updateDocumentField(userId, {
                family_dynamic: familyDynamicsName
              });
            }
          });
        });
      });
    });
  }

}

module.exports = UsersElasticSearchSync;
