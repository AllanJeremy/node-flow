'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reported_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      reported_by: {
        type: Sequelize.INTEGER
      },
      reason: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.DataTypes.ENUM('reported', 'flagged'),
        defaultValue: 'reported',
      },
      status: {
        type: Sequelize.BOOLEAN
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reported_users');
  }
};