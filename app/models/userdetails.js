'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserDetails.init({
    user_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    race_id: DataTypes.INTEGER,
    gender_id: DataTypes.INTEGER,
    sexual_orientation_id: DataTypes.INTEGER,
    family_detail_id: DataTypes.INTEGER,
    mental_health_section_id: DataTypes.INTEGER,
    conversation_starter_id: DataTypes.JSON,
    short_story: DataTypes.STRING,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserDetails',
  });

  return UserDetails;
  
};