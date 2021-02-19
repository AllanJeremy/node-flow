'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admin_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: "unique_tag"
      },
      password: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      remember_token: {
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
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")
      },
    },
      {
        underscored: true,
        uniqueKeys: {
          unique_tag: {
            customIndex: true,
            fields: ["email"]
          }
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('admin_users');
  }
};