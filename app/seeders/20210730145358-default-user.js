'use strict';

const bcrypt = require('bcryptjs');

var Sequelize = require('sequelize');
var Op = Sequelize.Op;

var Chat = require('../helpers/Chat');
Chat = new Chat();

const SystemConstants = require('../config/constants.js');
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

    var uniqueId = (new Date().getTime()).toString(36);
    var chatToken = await Chat.token(uniqueId);

    var healthCategory = [
      'Anxiety',
      'Depression',
      'Panic Attacks',
      'Grief or Bereavement',
      'Stress or Burnout'
    ];

    var result = await queryInterface.bulkInsert('users', [{
      name_prefix: 'they_them',
      first_name: 'L&K',
      email: SystemConstants.SYSTEM_BOT_EMAIL,
      password: bcrypt.hashSync('Teamjoyn2021', 8),
      profile_picture: 'default_peer.png',
      status: 1,
      published: 1,
      unique_id: uniqueId,
      type: userTypes.bot,
      chat_token: chatToken,
      created_at: new Date(),
      updated_at: new Date()
    }], {returning: true});

    var userId = Array.isArray(result) ? result[0].id : result;

    var streamUser = await Chat.createUser({
      id: uniqueId,
      user_id: userId,
      first_name: 'L&K',
      image: process.env.API_IMAGE_URL + '/avatar/default_peer.png',
      role: 'admin'
    });

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

    const userHealthCategory = await queryInterface.rawSelect('health_categories', {
      where: {
         name: {[Op.in]: [
      healthCategory
    ] }
      },
    }, ['id', 'name']);

    queryInterface.bulkInsert('user_health_categories', [{
      user_id: userId,
      health_category_id: 1,
      status: 1,
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
