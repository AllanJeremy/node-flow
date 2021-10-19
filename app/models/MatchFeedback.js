"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MatchFeedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MatchFeedback.init(
    {
      user_id: DataTypes.INTEGER,
      question: DataTypes.STRING,
      ratings: DataTypes.INTEGER,
      answer: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MatchFeedback",
      tableName: "match_feedbacks",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MatchFeedback;
};
