"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PromptOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  PromptOption.init(
    {
      text: DataTypes.STRING,
      prompt_id: DataTypes.INTEGER,
      emoji: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PromptOption",
      tableName: "prompt_options",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return PromptOption;
};
