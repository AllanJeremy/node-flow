"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserMatchingPreference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserMatchingPreference.init(
    {
      user_id: DataTypes.INTEGER,
      module: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserMatchingPreference",
      tableName: "user_matching_preferences",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return UserMatchingPreference;
};
