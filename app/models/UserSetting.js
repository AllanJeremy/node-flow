"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserSetting.init(
    {
      user_id: DataTypes.INTEGER,
      language_id: DataTypes.STRING,
      theme_color: DataTypes.STRING,
      font_size: DataTypes.STRING,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserSetting",
      tableName: "user_settings",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return UserSetting;
};
