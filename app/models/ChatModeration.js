"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatModeration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChatModeration.init(
    {
      message_id: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ChatModeration",
      tableName: "chat_moderations",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return ChatModeration;
};
