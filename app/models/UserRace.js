"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserRace.init(
    {
      user_id: DataTypes.INTEGER,
      race_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserRace",
      tableName: "user_races",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return UserRace;
};
