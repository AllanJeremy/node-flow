'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('channel_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      channel_id: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id'
        }
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
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('channel_users');
  }
};
