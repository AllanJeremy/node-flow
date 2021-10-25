"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserPrompt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  UserPrompt.init(
    {
      prompt_id: DataTypes.INTEGER,
      prompt_option_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      custom_value: DataTypes.STRING,
      show_on_profile: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "UserPrompt",
      tableName: "user_prompts",
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
    }
  );

  return UserPrompt;
};
