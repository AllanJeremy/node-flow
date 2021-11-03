"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Achievement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Achievement.hasMany(models.UserAchievement, {
        foreignKey: "achievement_id",
        as: "achievement",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }

  Achievement.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      image_url: DataTypes.STRING,
      trigger_table: DataTypes.STRING,
      user_id_column: DataTypes.STRING,
      trigger_event: {
        type: DataTypes.ENUM,
        values: ["create", "update", "delete"],
      },
      action_type: {
        type: DataTypes.ENUM,
        values: ["count_records", "column_check"],
      },
      action_field: DataTypes.STRING,
      action_operator: {
        type: DataTypes.ENUM,
        values: [
          "less_than",
          "less_than_or_equal_to",
          "equal_to",
          "greater_than",
          "greater_than_or_equal_to",
        ],
      },
      action_comparison_value: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Achievement",
      tableName: "achievements",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Achievement;
};
