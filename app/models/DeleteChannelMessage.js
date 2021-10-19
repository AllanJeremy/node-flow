"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DeleteChannelMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DeleteChannelMessage.init(
    {
      message_id: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DeleteChannelMessage",
      tableName: "delete_channel_messages",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return DeleteChannelMessage;
};
