'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeclinedPeer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DeclinedPeer.init({
    user_id: DataTypes.INTEGER,
    peer_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DeclinedPeer',
    tableName: 'declined_peers',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return DeclinedPeer;
};
