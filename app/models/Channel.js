'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Channel.init({
    channel_id: DataTypes.STRING,
    message_retention: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Channel',
    tableName: 'channels',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Channel;
};
