"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    getExceptionalEmail() {
      var exceptionalEmails = ["kotadiachintan@gmail.com", "joyn@one.com"];

      return exceptionalEmails;
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name_prefix: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      birth_date: DataTypes.STRING,
      profile_picture: DataTypes.STRING,
      status: DataTypes.INTEGER,
      access_token: DataTypes.STRING,
      published: DataTypes.INTEGER,
      chat_token: DataTypes.STRING,
      unique_id: DataTypes.STRING,
      type: DataTypes.STRING,
      hide_from_list: DataTypes.STRING,
      social_access_token: DataTypes.JSON,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      //paranoid: true,
    }
  );

  return User;
};
