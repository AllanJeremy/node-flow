"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserHealthJourney extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserHealthJourney.init(
    {
      user_id: DataTypes.INTEGER,
      health_journey_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserHealthJourney",
      tableName: "user_health_journeys",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return UserHealthJourney;
};
