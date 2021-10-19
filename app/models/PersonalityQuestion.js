"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PersonalityQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PersonalityQuestion.init(
    {
      question: DataTypes.STRING,
      options: DataTypes.JSON,
      sequence: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PersonalityQuestion",
      tableName: "personality_questions",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return PersonalityQuestion;
};
