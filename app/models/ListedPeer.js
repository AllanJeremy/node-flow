"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ListedPeer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ListedPeer.init(
    {
      user_id: DataTypes.INTEGER,
      peer_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ListedPeer",
      tableName: "listed_peers",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return ListedPeer;
};
