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


const StatusHandler = require('../helpers/StatusHandler');

/**
 * Manages Elastic search sync
 *
 * @class UsersElasticSearchSync
 * @package app
 * @subpackage scripts
 */
class UsersElasticSearchSync {

  index = () => {
    console.log("Testinggnngng");
    User.findAll().then(async users => {
      for(let i = 0; i < users.length; i++) {
        var user = users[i];
        await this.sync(user);
      }
    });
  }

  sync = async(user) => {
    var userId = user.id;
    var userDetail = await UserMetadata.findOne({
      where: {
        user_id: userId
      }
    });

    //sync user health categories
    var userHealthCategories = await UserHealthCategory.findAll({
      attributes: ['health_category_id'],
      where: {
        user_id: userId
      },
      include: [{
        model: HealthCategory,
        attributes: ['id', 'name'],
        as: 'health_category'
      }]
    });
    let healthCategoriesName = [];
    if(userHealthCategories.length > 0) {
      healthCategoriesName = userHealthCategories.map(item => {
        return  item.health_category.name
      });
    }

    //sync user workouts
    var workouts = await UserWorkout.findAll({
      attributes: ['workout_id'],
      where: {
        user_id: userId
      },
      include: [{
        model: Workout,
        attributes: ['id', 'name'],
        as: 'workout',
      }]
    });
    let workoutsName = [];
    if(workouts.length > 0) {
      workoutsName = workouts.map(item => item.workout.name);
    }

    //sync user races
    var races = await UserRace.findAll({
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
    });
    let racesName = [];
    if(races.length > 0) {
      racesName = races.map(item => {return item['race.name']});
    }


    var gender = '';
    var sexualOrientation = '';
    if(userDetail) {

      //sync user gender
      var gender = await Gender.findOne({
        where: {
          id: userDetail.gender_id
        }
      });
      if(gender && gender.name){
        gender = gender.name
      }


      //sync sexual orientation
      sexualOrientation = await SexualOrientation.findOne({
        where: {
          id: userDetail.sexual_orientation_id
        }
      });
      if(sexualOrientation && sexualOrientation.name){
        sexualOrientation = sexualOrientation.name;
      }
    }

    //sync user family dynamic
    var familyDynamics = await UserFamilyDynamic.findAll({
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
    });
    let familyDynamicsName = [];
    if(familyDynamics.length > 0) {
      let familyDynamicsName = familyDynamics.map(item => item['family_dynamic.name']);
    }

    let userData = {
      id: userId,
      name: user ? user.first_name : '',
      profile_picture: user ? user.profile_picture : '',
      unique_id: user ? user.unique_id : '',
      health_categories: healthCategoriesName,
      workouts: workoutsName,
      race: racesName,
      gender: gender,
      sexual_orientation: sexualOrientation,
      family_dynamic: familyDynamicsName
    }
    await ElasticSearchHandler.addDocument(userId, userData);
  }

}

module.exports = UsersElasticSearchSync;
