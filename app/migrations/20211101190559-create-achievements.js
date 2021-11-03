"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("achievements", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      image_url: {
        type: Sequelize.STRING,
      },
      trigger_table: {
        type: Sequelize.STRING,
      },
      user_id_column: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "user_id",
      },
      trigger_event: {
        type: Sequelize.ENUM,
        values: ["create", "update", "delete"],
      },
      action_type: {
        type: Sequelize.ENUM,
        values: ["count_records", "column_check"],
        defaultValue: "count_records",
      },
      action_field: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      action_operator: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: [
          "less_than",
          "less_than_or_equal_to",
          "equal_to",
          "greater_than",
          "greater_than_or_equal_to",
        ],
        defaultValue: "greater_than_or_equal_to",
      },
      action_comparison_value: {
        allowNull: false,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("achievements");
  },
};
