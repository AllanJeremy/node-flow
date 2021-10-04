'use strict';

const SystemConstants = require('../config/constants.js');

const ElasticsearchEventsAction = require('../helpers/ElasticsearchEventsAction');

var ElasticsearchEventsHandler = require("../helpers/ElasticsearchEventsHandler");
ElasticsearchEventsHandler = new ElasticsearchEventsHandler();

var ElasticSearchHandler = require("../helpers/ElasticSearchHandler");
ElasticSearchHandler = new ElasticSearchHandler();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    queryInterface.sequelize.query(
    'SELECT * FROM "users" WHERE email = :email ', {
      replacements: {'email': SystemConstants.SYSTEM_BOT_EMAIL},
      type: queryInterface.sequelize.QueryTypes.SELECT
    }).then(user => {
      var userId = user[0].id;
      let userData = {
        id: userId
      }
      ElasticsearchEventsHandler.store(ElasticsearchEventsAction.createUser, userData);
      ElasticSearchHandler.addDocument(userId, userData)
      queryInterface.sequelize.query(
      'SELECT * FROM "user_metadata" WHERE user_id = :id ', {
        replacements: {'id': userId},
        type: queryInterface.sequelize.QueryTypes.SELECT
      }).then(userDetail => {
        let data = {
          id: userId,
          name: user[0].first_name,
          profile_picture: user[0].profile_picture,
          unique_id: user[0].unique_id,
        };

        ElasticsearchEventsHandler.store(ElasticsearchEventsAction.updateUser, data);
        ElasticSearchHandler.updateDocumentField(userId, data);

        queryInterface.sequelize.query(
        'SELECT * FROM "user_health_categories" left JOIN "health_categories"  on user_health_categories.health_category_id = health_categories.id  WHERE user_id = :id ', {
          replacements: {'id': userId},
          type: queryInterface.sequelize.QueryTypes.SELECT
        }).then(userHealthCategories => {
          let healthCategoriesName = userHealthCategories.map(item => item['name']);

          let data = {
            id: userId,
            name: healthCategoriesName
          }
          ElasticsearchEventsHandler.store(ElasticsearchEventsAction.healthCategoryUpdate, data);
          ElasticSearchHandler.updateDocumentField(userId, {
            health_categories: healthCategoriesName
          });
        });


        queryInterface.sequelize.query(
        'SELECT * FROM "user_workouts" WHERE user_id = :id ', {
          replacements: {'id': 2},
          type: queryInterface.sequelize.QueryTypes.SELECT
        }).then(userWorkouts => {
          userWorkouts.map((item) => {
            queryInterface.sequelize.query(
              'SELECT * FROM "workouts" WHERE id = :id ', {
                replacements: {'id': item.workout_id},
                type: queryInterface.sequelize.QueryTypes.SELECT
              }).then(workouts => {
              let workoutsName = workouts.map(item => item['name']);
              let data = {
                id: userId,
                name: workoutsName
              }
              ElasticsearchEventsHandler.store(ElasticsearchEventsAction.workoutUpdate, data);
            });
          });
        });

      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
