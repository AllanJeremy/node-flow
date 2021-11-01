"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Prompt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Prompt.init(
    {
      question: DataTypes.STRING,
      is_multiple_choice: DataTypes.BOOLEAN,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Prompt",
      tableName: "prompts",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Prompt;
};
