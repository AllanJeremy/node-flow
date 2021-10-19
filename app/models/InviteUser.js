"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InviteUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InviteUser.init(
    {
      user_id: DataTypes.INTEGER,
      invite_user_email: DataTypes.STRING,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "InviteUser",
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  return InviteUser;
};
