"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DelistedPeer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DelistedPeer.init(
    {
      user_id: DataTypes.INTEGER,
      peer_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DelistedPeer",
      tableName: "delisted_peers",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return DelistedPeer;
};
