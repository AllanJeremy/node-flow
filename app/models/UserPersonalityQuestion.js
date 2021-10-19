"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserPersonalityQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserPersonalityQuestion.init(
    {
      user_id: DataTypes.INTEGER,
      question_id: DataTypes.INTEGER,
      answer: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserPersonalityQuestion",
      tableName: "user_personality_questions",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return UserPersonalityQuestion;
};
