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
      summary: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        field: "created_at",
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")
      },
      updatedAt: {
        allowNull: false,
        field: "updated_at",
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")
      },
      deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null
      }
    },
      {
        underscored: true
      }
    );
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_details');
  }
};