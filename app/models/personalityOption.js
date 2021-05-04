'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalityOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PersonalityOption.init({
    question_id: DataTypes.INTEGER,
    option: DataTypes.STRING,
    caption: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonalityOption',
    tableName: 'personality_options',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return PersonalityOption;
};