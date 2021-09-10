'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_metadata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      gender_id: {
        type: Sequelize.INTEGER
      },
      gender_status: {
        type: Sequelize.INTEGER
      },
      sexual_orientation_id: {
        type: Sequelize.INTEGER
      },
      sexual_orientation_status: {
        type: Sequelize.INTEGER
      },
      race_status: {
        type: Sequelize.INTEGER
      },
      family_dynamic_status: {
        type: Sequelize.INTEGER
      },
      workout_status: {
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_metadata');
  }
};
