"use strict";

const bcrypt = require("bcryptjs");

var Sequelize = require("sequelize");
var Op = Sequelize.Op;

var Chat = require("../helpers/Chat");
Chat = new Chat();

const SystemConstants = require("../config/constants.js");
const userTypes = require("../helpers/UserTypes.js");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    var uniqueId = new Date().getTime().toString(36);
    var chatToken = await Chat.token(uniqueId);

    var healthCategories = [
      "Anxiety",
      "Depression",
      "Panic Attacks",
      "Grief or Bereavement",
      "Stress or Burnout",
    ];

    var workouts = [
      "Meditation",
      "Exercise",
      "Yoga",
      "Talk Therapy",
      "Arts and Crafts",
    ];

    var result = await queryInterface.bulkInsert(
      "users",
      [
        {
          name_prefix: "they_them",
          first_name: "L&K",
          email: SystemConstants.SYSTEM_BOT_EMAIL,
          password: bcrypt.hashSync("Teamjoyn2021", 8),
          profile_picture: "default_peer.png",
          status: 1,
          published: 1,
          unique_id: uniqueId,
          type: userTypes.bot,
          chat_token: chatToken,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    var userId = Array.isArray(result) ? result[0].id : result;

    var streamUser = await Chat.createUser({
      id: uniqueId,
      user_id: userId,
      first_name: "L&K",
      image: process.env.API_IMAGE_URL + "/avatar/default_peer.png",
      role: "admin",
    });

    queryInterface.bulkInsert("user_metadata", [
      {
        user_id: userId,
        gender_id: 1,
        gender_status: 1,
        sexual_orientation_id: 6,
        sexual_orientation_status: 1,
        summary:
          "Hi! We are Larissa and Kendra, the Founders of Joyn. We are so happy you're here and can't wait to build this community with you. We're here to be a resource to you in navigating the Joyn app or simply connect! Let's chat!",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    let healthCategoryIds = await queryInterface.sequelize.query(
      "SELECT id, name FROM health_categories WHERE name IN(:name)",
      {
        raw: true,
        replacements: { name: healthCategories },
        type: Sequelize.SELECT,
      }
    );

    healthCategoryIds = healthCategoryIds.length ? healthCategoryIds[0] : [];

    let userHealthCategories = [];
    healthCategoryIds.forEach((healthCategoryId) => {
      userHealthCategories.push({
        user_id: userId,
        health_category_id: healthCategoryId.id,
        status: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    queryInterface.bulkInsert("user_health_categories", userHealthCategories);

    let workoutIds = await queryInterface.sequelize.query(
      "SELECT id, name FROM workouts WHERE name IN(:name)",
      {
        raw: true,
        replacements: { name: workouts },
        type: Sequelize.SELECT,
      }
    );

    workoutIds = workoutIds.length ? workoutIds[0] : [];

    let userWorkouts = [];
    workoutIds.forEach((workoutId) => {
      userWorkouts.push({
        user_id: userId,
        workout_id: workoutId.id,
        status: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    queryInterface.bulkInsert("user_workouts", userWorkouts);

    queryInterface.bulkInsert("user_health_journeys", [
      {
        user_id: userId,
        health_journey_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    queryInterface.bulkInsert("user_conversation_starters", [
      {
        user_id: userId,
        conversation_starter_id: 4,
        answer: JSON.stringify("Cute"),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("users", null, {});
  },
};
