'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConversationStarter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ConversationStarter.init({
    question: DataTypes.STRING,
    sequence: DataTypes.INTEGER,
    number_of_answer: DataTypes.STRING,
    answer_label: DataTypes.JSON,
    question_icon: DataTypes.STRING,
    status: DataTypes.INTEGER,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ConversationStarter',
    tableName: 'conversation_starters',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
  });
  return ConversationStarter;
};
