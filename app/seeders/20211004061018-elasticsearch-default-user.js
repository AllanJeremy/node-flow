"use strict";

const SystemConstants = require("../config/constants.js");

const ElasticsearchEventsAction = require("../helpers/ElasticsearchEventsAction");

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

    queryInterface.sequelize
      .query('SELECT * FROM "users" WHERE email = :email ', {
        replacements: { email: SystemConstants.SYSTEM_BOT_EMAIL },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      })
      .then(async (user) => {
        var userId = user[0].id;
        let userData = {
          id: userId,
        };

        ElasticsearchEventsHandler.store(
          ElasticsearchEventsAction.createUser,
          userData
        );
        await ElasticSearchHandler.addDocument(userId, userData);

        // sync user detail
        queryInterface.sequelize
          .query('SELECT * FROM "user_metadata" WHERE user_id = :id ', {
            replacements: { id: userId },
            type: queryInterface.sequelize.QueryTypes.SELECT,
          })
          .then((userDetail) => {
            let data = {
              id: userId,
              name: user[0].first_name,
              profile_picture: user[0].profile_picture,
              unique_id: user[0].unique_id,
            };

            ElasticsearchEventsHandler.store(
              ElasticsearchEventsAction.updateUser,
              data
            );
            ElasticSearchHandler.updateDocumentField(userId, data);

            //sync user health categories
            queryInterface.sequelize
              .query(
                'SELECT * FROM "user_health_categories" left JOIN "health_categories"  on user_health_categories.health_category_id = health_categories.id  WHERE user_id = :id ',
                {
                  replacements: { id: userId },
                  type: queryInterface.sequelize.QueryTypes.SELECT,
                }
              )
              .then((userHealthCategories) => {
                if (userHealthCategories.length > 0) {
                  let healthCategoriesName = userHealthCategories.map(
                    (item) => item["name"]
                  );

                  let data = {
                    id: userId,
                    name: healthCategoriesName,
                  };
                  ElasticsearchEventsHandler.store(
                    ElasticsearchEventsAction.healthCategoryUpdate,
                    data
                  );
                  ElasticSearchHandler.updateDocumentField(userId, {
                    health_categories: healthCategoriesName,
                  });
                }
              });

            //sync user workouts
            queryInterface.sequelize
              .query(
                'SELECT * FROM "user_workouts" left JOIN "workouts"  on user_workouts.workout_id = workouts.id  WHERE user_id = :id ',
                {
                  replacements: { id: userId },
                  type: queryInterface.sequelize.QueryTypes.SELECT,
                }
              )
              .then((workouts) => {
                if (workouts.length > 0) {
                  let workoutsName = workouts.map((item) => item["name"]);
                  let data = {
                    id: userId,
                    name: workoutsName,
                  };
                  ElasticsearchEventsHandler.store(
                    ElasticsearchEventsAction.workoutUpdate,
                    data
                  );
                  ElasticSearchHandler.updateDocumentField(userId, {
                    workouts: workoutsName,
                  });
                }
              });

            //sync user races
            queryInterface.sequelize
              .query(
                'SELECT * FROM "user_races" left JOIN "races" on user_races.race_id = races.id  WHERE user_id = :id ',
                {
                  replacements: { id: userId },
                  type: queryInterface.sequelize.QueryTypes.SELECT,
                }
              )
              .then((races) => {
                if (races.length > 0) {
                  let racesName = races.map((item) => item["name"]);
                  let data = {
                    id: userId,
                    name: racesName,
                  };
                  ElasticsearchEventsHandler.store(
                    ElasticsearchEventsAction.raceUpdate,
                    data
                  );
                  ElasticSearchHandler.updateDocumentField(userId, {
                    race: racesName,
                  });
                }
              });

            //sync user gender
            queryInterface.sequelize
              .query('SELECT * FROM "genders" WHERE id = :id ', {
                replacements: { id: userDetail[0].gender_id },
                type: queryInterface.sequelize.QueryTypes.SELECT,
              })
              .then((gender) => {
                if (gender.length > 0) {
                  let data = {
                    id: userId,
                    name: gender[0].name,
                  };
                  ElasticsearchEventsHandler.store(
                    ElasticsearchEventsAction.genderUpdate,
                    data
                  );
                  ElasticSearchHandler.updateDocumentField(userId, {
                    gender: gender[0].name,
                  });
                }
              });

            //sync sexual orientation
            queryInterface.sequelize
              .query('SELECT * FROM "sexual_orientations" WHERE id = :id ', {
                replacements: { id: userDetail[0].sexual_orientation_id },
                type: queryInterface.sequelize.QueryTypes.SELECT,
              })
              .then((sexualOrientation) => {
                if (sexualOrientation.length > 0) {
                  let data = {
                    id: userId,
                    name: sexualOrientation[0].name,
                  };
                  ElasticsearchEventsHandler.store(
                    ElasticsearchEventsAction.sexualOrientationUpdate,
                    data
                  );
                  ElasticSearchHandler.updateDocumentField(userId, {
                    sexual_orientation: sexualOrientation[0].name,
                  });
                }
              });

            //sync user family dynamic
            queryInterface.sequelize
              .query(
                'SELECT * FROM "user_family_dynamics" left JOIN "family_dynamics" on user_family_dynamics.id = family_dynamics.id WHERE user_id = :id',
                {
                  replacements: { id: userId },
                  type: queryInterface.sequelize.QueryTypes.SELECT,
                }
              )
              .then((familyDynamics) => {
                if (familyDynamics.length > 0) {
                  let familyDynamicsName = familyDynamics.map(
                    (item) => item["name"]
                  );
                  let data = {
                    id: userId,
                    name: familyDynamicsName,
                  };
                  ElasticsearchEventsHandler.store(
                    ElasticsearchEventsAction.raceUpdate,
                    data
                  );
                  ElasticSearchHandler.updateDocumentField(userId, {
                    race: familyDynamicsName,
                  });
                }
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
  },
};
