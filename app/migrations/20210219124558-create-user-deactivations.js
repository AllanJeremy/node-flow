"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "user_deactivations",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        user_id: {
          type: Sequelize.INTEGER,
        },
        reason: {
          type: Sequelize.STRING,
        },
        is_allow_to_contact: {
          type: Sequelize.INTEGER,
        },
        contact_email: {
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          field: "created_at",
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
        updatedAt: {
          allowNull: false,
          field: "updated_at",
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
        deleted_at: {
          type: Sequelize.DATE,
          defaultValue: null,
        },
      },
      {
        underscored: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_deactivations");
  },
};
