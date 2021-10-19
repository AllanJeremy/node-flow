"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExportChannel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ExportChannel.init(
    {
      channel_id: DataTypes.INTEGER,
      task_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ExportChannel",
      tableName: "export_channels",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return ExportChannel;
};
