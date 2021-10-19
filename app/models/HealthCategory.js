"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HealthCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HealthCategory.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.INTEGER,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "HealthCategory",
      tableName: "health_categories",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );

  return HealthCategory;
};
