"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SexualOrientation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SexualOrientation.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.INTEGER,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "SexualOrientation",
      tableName: "sexual_orientations",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );

  return SexualOrientation;
};
