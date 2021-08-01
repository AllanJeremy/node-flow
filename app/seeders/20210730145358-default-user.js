'use strict';

const bcrypt = require('bcryptjs');

var Chat = require('../helpers/Chat');
Chat = new Chat();

const defaultUserEmailId = require('../config/constants.js');
const userTypes = require('../helpers/UserTypes.js');

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

    var uniqueId=(new Date().getTime()).toString(36);

    var chatToken = await Chat.token(uniqueId);

    var result = await queryInterface.bulkInsert('users', [{
      name_prefix: 'miss',
      first_name: 'L&K',
      email: defaultUserEmailId.DEFAULT_USER_EMAIL_ID,
      password: bcrypt.hashSync('Teamjoyn2021', 8),
      profile_picture: process.env.API_IMAGE_URL + '/avatar/default_peer.png',
      status: 1,
      published: 1,
      unique_id: uniqueId,
      type: userTypes.bot,
      chat_token: chatToken,
      created_at: new Date(),
      updated_at: new Date()
    }], {returning: true});

    var userId = result[0].id;

    queryInterface.bulkInsert('user_metadata', [{
      user_id: userId,
      gender_id: 1,
      gender_status: 1,
      sexual_orientation_id: 1,
      sexual_orientation_status:1,
      summary:'',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    queryInterface.bulkInsert('user_health_journeys', [{
      user_id: userId,
      health_journey_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }]);

    queryInterface.bulkInsert('user_conversation_starters', [{
      user_id: userId,
      conversation_starter_id: 4,
      answer: JSON.stringify('Cat'),
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('users', null, {});
  }
};
