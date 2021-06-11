'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserConversationStarter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserConversationStarter.init({
    user_id: DataTypes.INTEGER,
    conversation_starter_id: DataTypes.INTEGER,
    answer: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'UserConversationStarter',
    tableName: 'user_conversation_starters',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return UserConversationStarter;
};
