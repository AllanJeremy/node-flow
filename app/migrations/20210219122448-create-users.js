"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "users",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        email: {
          type: Sequelize.STRING,
          unique: "unique_tag",
        },
        password: {
          type: Sequelize.STRING,
        },
        name_prefix: {
          type: Sequelize.STRING,
        },
        first_name: {
          type: Sequelize.STRING,
        },
        last_name: {
          type: Sequelize.STRING,
        },
        birth_date: {
          type: Sequelize.STRING,
        },
        profile_picture: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.INTEGER,
        },
        access_token: {
          type: Sequelize.STRING,
        },
        published: {
          type: Sequelize.INTEGER,
        },
        chat_token: {
          type: Sequelize.STRING,
        },
        unique_id: {
          type: Sequelize.STRING,
        },
        type: {
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
        uniqueKeys: {
          unique_tag: {
            customIndex: true,
            fields: ["email"],
          },
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
