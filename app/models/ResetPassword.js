"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResetPassword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResetPassword.init(
    {
      user_id: DataTypes.INTEGER,
      verification_code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ResetPassword",
      tableName: "reset_passwords",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return ResetPassword;
};
