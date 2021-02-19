'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      race_id: {
        type: Sequelize.INTEGER
      },
      gender_id: {
        type: Sequelize.INTEGER
      },
      sexual_orientation_id: {
        type: Sequelize.INTEGER
      },
      family_detail_id: {
        type: Sequelize.INTEGER
      },
      mental_health_section_id: {
        type: Sequelize.INTEGER
      },
      conversation_starter_id: {
        type: Sequelize.JSON
      },
      short_story: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")
      },
      deletedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_details');
  }
};