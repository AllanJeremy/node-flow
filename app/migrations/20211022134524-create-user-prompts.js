"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_prompts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      prompt_id: {
        allowNull: false,
        onDelete: "SET NULL",
        type: Sequelize.INTEGER,
        references: {
          model: "prompts",
          key: "id",
        },
      },
      prompt_option_id: {
        type: Sequelize.INTEGER,
        onDelete: "SET NULL",
        references: {
          model: "prompt_options",
          key: "id",
        },
        defaultValue: null,
      },
      user_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id",
        },
      },
      custom_value: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      show_on_profile: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_prompts");
  },
};
